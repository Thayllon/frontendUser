import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import * as moment from 'moment';
import { User } from 'src/app/shared/models/User';
import { ApiService } from 'src/app/shared/service/Api.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ApiService]
})
export class HomeComponent implements OnInit {

  @ViewChild(MatTable)
  table!: MatTable<any>;
  displayedColumns: string[] = ['id', 'nome', 'sobrenome', 'email', 'dataNascimento', 'escolaridade', 'action'];
  dataSource!: User[];

  constructor(public dialog: MatDialog, private _apiService: ApiService) {
    this._apiService.getUsers().subscribe((data: User[]) => {

      for (let index = 0; index < data.length; index++) {
        data[index].dataNascimento = this.formatDate(data[index].dataNascimento);
      }
      this.dataSource = data;
    });
  }

  ngOnInit(): void {
  }

  openDialog(user: User | null): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: user === null ? {
        nome: '',
        sobrenome: '',
        email: '',
        dataNascimento: new Date().toISOString().slice(0, 10),
        escolaridade: '',
      } : {
        id: user.id,
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
        dataNascimento: moment(user.dataNascimento, "DD/MM/YYYYTHH:mm:SS").format("YYYY/MM/DD"),
        escolaridade: user.escolaridade,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.dataSource.map(u => u.id).includes(result.id)) {
          this._apiService.editUser(result).subscribe((data: User) => {
            const index = this.dataSource.findIndex(u => u.id === data.id);
            data.dataNascimento = this.formatDate(data.dataNascimento);
            this.dataSource[index] = data;
            this.table.renderRows();
          });
        } else {
          this._apiService.postUser(result).subscribe((data: User) => {
            data.dataNascimento = this.formatDate(data.dataNascimento);
            this.dataSource.push(data);
            this.table.renderRows();
          });
        }
      }
    });
  }

  editUser(user: User | null): void {
    this.openDialog(user);
  }

  deleteUser(id: number): void {
    this._apiService.deleteUser(id).subscribe(() => {
      this.dataSource = this.dataSource.filter(u => u.id !== id)
    });
  }

  formatDate(dataNascimento: any) {
    let date = moment(dataNascimento).format("DD/MM/YYYY");
    return date;
  }
}
