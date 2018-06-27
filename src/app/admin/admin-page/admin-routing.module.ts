import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGuard } from '../../_guards/index';
import { AdminPageComponent } from './admin-page.component';
import { AdminDashComponent } from '../layout/admin-dash/admin-dash.component';
import { AdminTableMotelComponent } from '../layout/admin-table-motel/admin-table-motel.component';
import { AdminTableModComponent} from '../layout/admin-mode/admin-table-mod.component';
import { AdminTableCommentComponent } from '../layout/admin-table-comment/admin-table-comment.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '',
        canActivate: [AdminGuard],
        children: [
          {path: '', component: AdminDashComponent},
          {path: 'home', component: AdminDashComponent},
          {path: 'motel', component: AdminTableMotelComponent},
          {path: 'comment', component: AdminTableCommentComponent},
          {path: 'mod', component: AdminTableModComponent}
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
