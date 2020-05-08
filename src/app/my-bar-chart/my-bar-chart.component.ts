import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-my-bar-chart',
  templateUrl: './my-bar-chart.component.html',
  styleUrls: ['./my-bar-chart.component.css']
})
export class MyBarChartComponent implements OnInit {

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive : true
  }

  public barChartData: Array<Object>;
  @Input('chartData') data = Array;

  public barChartType = "bar";
  public barChartlegend = true;
  public barChartLabels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
  //public barChartLabels = [0,1,2,3]

  constructor() { console.log("called"); }

  ngOnInit() {
    //this.barChartData = [{data:this.data,label:'randomLabel'}];
    this.barChartData = [{data:[4,2,8],label:'randomLabel'}];
  }

}
