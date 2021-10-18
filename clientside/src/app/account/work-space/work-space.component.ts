import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ItemService } from '../../services/item.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewTransactionComponent } from '../view-transaction/view-transaction.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-work-space',
  templateUrl: './work-space.component.html',
  styleUrls: ['./work-space.component.css']
})
export class WorkSpaceComponent implements OnInit {
  transactionStatistics = {allTransactionsNumber: 0, creditTransactionsNumber: 0, debitTransactionsNumber: 0};
  //  All transactions logic
  allTransactionsDataSource: any;
  showAllTransactionsLoadingSpinner = true;
  allTransactions: any;
  allTransactionsTableDisplayedColumns: string[] = ['transactionID', 'with', 'transactionType', 'amount', 'newBalance'];

  //  credit transactions
  creditTransactionsTableDisplayedColumns: string[] = ['transactionID', 'debtor', 'amount', 'newBalance'];
  creditTransactionsDataSource: any;

  //  debit transactions
  debitTransactionsTableDisplayedColumns: string[] = ['transactionID', 'creditor', 'amount', 'newBalance'];
  debitTransactionsDataSource: any;

  //  new transaction
  passwordTrials = 3;
  transactForm: FormGroup;
  potentialDebtors: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public authService: AuthService,
    private itemService: ItemService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadAllTransactions();
    this.initializeTransactForm();
  }
  // method to load all transactions debit and credit from server
  loadAllTransactions(): void{
    this.itemService.get(this.itemService.baseURL + 'transactions/all/' + this.authService.currentUser.id as string)
      .subscribe(data => this.allTransactions = data);
    // logic to wait for server response
    this.showAllTransactionsLoadingSpinner = true;
    setTimeout(() => {
      this.showAllTransactionsLoadingSpinner = false;
      this.loadDataSources();
    }, 5000);
    setTimeout(() => {
      this.allTransactionsDataSource.sort = this.sort;
      this.allTransactionsDataSource.paginator = this.paginator;
      this.debitTransactionsDataSource.sort = this.sort;
      this.debitTransactionsDataSource.paginator = this.paginator;
      this.creditTransactionsDataSource.sort = this.sort;
      this.creditTransactionsDataSource.paginator = this.paginator;
    }, 6000);
  }
  //  method to initialise make new transaction form
  initializeTransactForm(): void {
    this.itemService.get(this.itemService.baseURL + 'users/')
      .subscribe(data => {
        this.potentialDebtors = data.filter(user => user.id !== this.authService.currentUser.id);
      });
    this.transactForm = this.formBuilder.group(
      {
        password: new FormControl('', [Validators.required, Validators.minLength(4)]),
        debtor: new FormControl('', [Validators.required]),
        creditor: new FormControl(this.authService.currentUser.id, [Validators.required, Validators.min(1)]),
        amount: new FormControl('', [Validators.required, Validators.min(0.01)]),
        purpose: new FormControl('', [Validators.minLength(3)])
      }
    );
  }
  //  method to load data sources
  loadDataSources(): void {
    this.allTransactionsDataSource = new MatTableDataSource(this.allTransactions);
    this.creditTransactionsDataSource = new MatTableDataSource(
      this.allTransactions.filter(transaction => transaction.creditor.id === this.authService.currentUser.id)
    );
    this.debitTransactionsDataSource = new MatTableDataSource(
      this.allTransactions.filter(transaction => transaction.debtor.id === this.authService.currentUser.id)
    );
    this.transactionStatistics = {
      allTransactionsNumber: this.allTransactions.length,
      creditTransactionsNumber: this.allTransactions.filter(
        transaction => transaction.creditor.id === this.authService.currentUser.id
      ).length,
      debitTransactionsNumber: this.allTransactions.filter(
        transaction => transaction.debtor.id === this.authService.currentUser.id
        ).length
    };
  }
  // method to make a transaction call to the server
  transact(): void {
    if (
      this.transactForm.value.password !== this.authService.currentUser.password
      || this.transactForm.value.creditor !== this.authService.currentUser.id
    ){
      this.passwordTrials -= 1;
      this.openSnackBar(`Incorrect password you have ${this.passwordTrials} trials left!!!`);
      if (this.passwordTrials === 0) {
        this.router.navigateByUrl('/login');
      }
      return;
    }
    if (
      confirm(`Are you sure you want to transfer $${this.transactForm.value.amount} to account number ${this.transactForm.value.debtor}?`)
      ){
        this.itemService.post(this.transactForm.value, this.itemService.baseURL + 'transactions/new/0')
          .subscribe(
            data => {
              if (data.id !== undefined) {
                this.loadAllTransactions();
                $('#resetTransactionFormButton').trigger('click');
                this.authService.authenticate(
                  this.authService.currentUser.id, this.authService.currentUser.password
                );
                this.openSnackBar(`
                Successfully transferred $${data.amount} to ${data.debtor} your new balance is: $${data.creditorBalance}
                `);
              } else {
                this.openSnackBar(`$ ${data.amount} to account number ${data.creditor}  failed!!!`);
              }

            }
        );
    }
    return;
  }
  /*
  applyFilter = (filterValue: string) => {
    this.allTransactionsDataSource.filter = filterValue.trim().toLowerCase();
  }
  */
  openViewTransactionDialog(transaction): void {
    const dialogRef = this.dialog.open(
      ViewTransactionComponent, {data: transaction}
      );
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
      }
    );
  }
  //  method to  open a snackbar
  openSnackBar(message: string): void {
    this.snackBar.open(message, 'dismiss');
  }
  //  method to determine if a transaction is debit or credit
  getTransactionType(transaction): boolean {
    if (this.authService.currentUser.id === transaction.debtor.id) {
      return true;
    } else {
      return false;
    }
  }

}
