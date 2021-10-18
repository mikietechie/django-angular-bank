import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  testForm: FormGroup;
  imageURL: string;
  url: string;
  image: any;


  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService
  ) { }

  ngOnInit(): void {
    this.url = this.itemService.baseURL + 'users/';
    this.testForm = this.formBuilder.group(
      {
        password: new FormControl('', [Validators.required, Validators.minLength(4)]),
        username: new FormControl('', [Validators.required, Validators.minLength(4)]),
        first_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
        last_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.minLength(6), Validators.email]),
        account_type: new FormControl('', [Validators.required])
        // image: new FormControl('')/*  hello  */
      }
    );
  }


  create(): void {
    // this.testForm.setValue({image: this.imageURL});
    this.itemService.post(this.testForm.value, this.url)
    .subscribe(data => {alert(data); });
  }

  selectFiles(event): void {
    if (event.target.files){
      this.image = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imageURL = event.target.result;
      }
    }
  }

}
