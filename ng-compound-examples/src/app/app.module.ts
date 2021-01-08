import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {GraphEdgeComponent} from "./graph-edge.component";
import {GraphNodeComponent} from "./graph-node.component";

@NgModule({
  declarations: [
    AppComponent,
    GraphEdgeComponent,
    GraphNodeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
