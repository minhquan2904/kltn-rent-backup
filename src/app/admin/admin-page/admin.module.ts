import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatCheckboxModule, MatTabsModule, MatPaginatorModule, 
        MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule} from '@angular/material';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminPageComponent } from './admin-page.component';
import { AdminNavComponent} from '../layout/admin-nav/admin-nav.component';
import { AdminDashComponent } from '../layout/admin-dash/admin-dash.component';
import { AdminTableMotelComponent } from '../layout/admin-table-motel/admin-table-motel.component';
import { AdminMenuComponent } from '../layout/admin-menu/admin-menu.component';
import { AdminTableCommentComponent } from '../layout/admin-table-comment/admin-table-comment.component';
import { AlertComponent } from '../layout/alert/alert.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatButtonModule, MatCheckboxModule, MatTabsModule,
    MatPaginatorModule, MatTableModule, MatSortModule,
    MatFormFieldModule, MatInputModule
  ],
  declarations: [
    AdminPageComponent,
    AdminNavComponent,
    AdminDashComponent,
    AdminTableMotelComponent,
    AdminTableCommentComponent,
    AlertComponent
  ]
})
export class AdminModule { }
