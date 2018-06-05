import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MotelService } from '../../../_services/index';
import { Motel} from '../../../_models/index';
@Component({
  selector: 'app-admin-table-motel',
  templateUrl: './admin-table-motel.component.html',
  styleUrls: ['./admin-table-motel.component.css']
})
export class AdminTableMotelComponent implements OnInit {
  viewAccepted = false;
  listMotel: Observable<Motel[]>;
  constructor(private motelService: MotelService) { }

  ngOnInit() {
    this.listMotel = this.motelService.findByStatus(0);

  }
  handleAccepted() {
    this.viewAccepted = !this.viewAccepted;
  }
}
