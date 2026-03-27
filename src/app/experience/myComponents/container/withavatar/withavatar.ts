import { Component, Input } from '@angular/core';
import { AvatarPipe } from '../../../../shared/pipes/avatar-pipe';
import { Toptab } from "../../btn/toptab/toptab";


@Component({
  selector: 'app-withavatar',
  imports: [AvatarPipe, Toptab],
  templateUrl: './withavatar.html',
  styleUrl: './withavatar.css',
})
export class Withavatar {
  @Input() ava: string | null = null;
  @Input() title = "Title";
}
