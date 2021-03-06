//report.component.ts
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../Services/reportservice';
import { ReportEmp } from '../Model/reportemp';
import { ReportManager } from '../Model/reportmanager';
import { ReportVendor } from '../Model/reportvendor';
import { DashData } from '../dash/dashData';
import { ReportManagerDetail } from '../Model/ReportEmpDet';
import { ReportVendorDetail } from '../Model/ReportVendorDetai';
import { ReportEmpDetail } from '../Model/ReportEmpDetail';
import { VendorBilling } from '../Model/VendorBilling'
import { TransportationCost } from './TransportationCost';
import { Checkinout } from '../Model/Checkinout';
import { TransBillReport } from '../Model/TransBillReport';
import { IMyDpOptions } from 'mydatepicker';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  public employeeReport: ReportEmp;
  public managerReport: ReportManager;
  public vendorReport: ReportVendor;
  public employeeDetailReport: ReportEmpDetail;
  public vendorDetailReport: ReportVendorDetail;
  public managerDetailReport: ReportManagerDetail;
  public transBillReport: TransBillReport;
  public BillingSummaryReport: VendorBilling;
  public Checkinoutreport: Checkinout;
  public filterType = '';
  public filterValue;
  public filterVal;
  public vname = [];
  public rname = [];
  public reports = [];
  public cno = [];
  public EmpName;
  public modelf;
  public modelt;
  public fdate;
  public tdate;
  public fromMonth;
  public year;
  public shiftValue;
  public fromDate;
  public toDate;


  public filterReport;
  public tf = false;
  public showTransportationReportResult = false;
  public showDiv = true;
  message = "";
  module = "REPORTS";
  navLocation = " ";

  ////-------------data for loader-------------
  public showLoader = false;
  public loaderText = "Loading...";
  ////-----------------------------------------

  constructor(public reportService: ReportService, public _dashData: DashData) {
    // console.log("constructor");
  }


  ngOnInit() {
    //  console.log("ngOnInit");
    // this.filterReport = this._dashData.getItem();
  }

  //to toggle filter panel
  toggleFilter(flag) {
    // console.log(flag);
    this.tf = flag;
  }

  // to download Excel
  downloadExcel() {

    if (this.filterReport == 'Vendor Billing Detail') {
      //Calculations start
      console.log(">>>filtertype: " + this.filterReport);

      var sumfields = [".Cab_Charge", "input[name=HR_Tax]", "input[name=UP_Tax]", "input[name=Gps]", "input[name=Toll]"];
      var totalfields = [".Total", ".Total_HR_Tax", ".Total_UP_Tax", ".Total_Gps", ".Total_Toll"];

      var finalsumfields = [".Total_Cab_Charge", ".Total_HR_Tax", ".Total_UP_Tax", ".Total_Gps", ".Total_Toll"];


      $(".Cab_Charge").each(function () {
        $(this).html(
          Number($(this).prev().html()) * Number($(this).prev().prev().find("input").val()) / Number($(this).prev().prev().prev().html()));
      });


      for (var x = 0; x < sumfields.length; x++) {
        var sum = 0;
        $(sumfields[x]).each(function () {
          if ($(this).is("td"))
            sum += Number($(this).html());
          else
            sum += Number($(this).val());
        })
        $(totalfields[x]).html(sum);
      }

      $(".Gst_Tax").html(Number(($(".Total").html()) * Number($("input[name=Gst_Rate]").val())) / 100);
      $(".Total_Cab_Charge").html(Number($(".Total").html()) + Number($(".Gst_Tax").html()));

      var finalsum = 0;

      for (var val in finalsumfields)
        finalsum += Number($(finalsumfields[val]).html());

      $(".Final_Total_Amount").html(finalsum);


      //Calculations end

      $("td").each(function () {
        if ($(this).find("input"))
          $(this).html($(this).find("input").val());
      });

      $(".Total_Amount").each(function () {
        $(this).html(Number($(this).prev().html()) + Number($(this).prev().prev().html()) + Number($(this).prev().prev().prev().html()) + Number($(this).prev().prev().prev().prev().html()) + Number($(this).prev().prev().prev().prev().prev().html()));
      });
      var indsum = 0;
      $(".Total_Amount").each(function () {
        indsum += Number($(this).html());
      });
      $(".indsum").html(indsum);
      $(".Final_Total_Amount").html(indsum + Number($(".Gst_Tax").html()));

    }

    var name = "test";
    var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
      , base64 = function (s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }
      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

    var table = document.getElementsByClassName("table")[0]
    var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
    // window.location.href = uri + base64(format(template, ctx))
    var downloadLink = document.createElement("a");
    downloadLink.href = uri + base64(format(template, ctx));
    downloadLink.download = this.filterReport +"_"+ new Date().toLocaleString()+".xls";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

  }

  //filter method
  onFilterGo(f) {

    switch (this.filterReport) {

      case "Unschedule Summary By Manager":
        this.reportService.getManagerReport(f.toDate, f.fromDate, this.filterVal).subscribe((data) => {
          this.reports = data;
          this.showLoader = false;
          this.showDiv = true;

          console.log(data);
        });
        break;

      case "Unschedule Summary By Employee":
        this.reportService.getEmployeeReport(f.toDate, f.fromDate, this.filterVal).subscribe((data) => {
          this.reports = data;
          this.showLoader = false;
          this.showDiv = true;

          console.log(data);
        }); break;

      case "Unschedule Summary By Vendor":
        this.reportService.getVendorReport(f.toDate, f.fromDate, this.filterVal).subscribe((data) => {
          this.reports = data;
          this.showLoader = false;
          this.showDiv = true;

          console.log(data);
        }); break;
      case "Unschedule Detail By Vendor":
        this.reportService.getVendorReportDetail(f.toDate, f.fromDate, this.filterVal).subscribe((data) => {
          this.reports = data;
          this.showLoader = false;
          this.showDiv = true;

          console.log(data);
        }); break;
      case "Unschedule Detail By Employee":
        this.reportService.getEmployeeReportDetail(f.toDate, f.fromDate, this.filterVal).subscribe((data) => {
          this.reports = data;
          this.showLoader = false;
          this.showDiv = true;

          console.log(data);
        }); break;
      case "Unschedule Detail By Manager":
        this.reportService.getManagerReportDetail(f.toDate, f.fromDate, this.filterVal).subscribe((data) => {
          this.reports = data;
          this.showLoader = false;
          this.showDiv = true;

          console.log(data);
        }); break;
      case "Vendor Billing Detail":
        this.reportService.getBillingSummary(this.shiftValue, f.VendorName, this.fromDate, this.toDate).subscribe((data) => {
          this.BillingSummaryReport = data;
          this.showLoader = false;
          this.showDiv = true;

          console.log(data);
        }); break;
      case "Checkin Checkout":
        this.showDiv = true;
        this.getdata(f);

        break;

      default:
        console.log(this.filterReport);
    }


  }

  resetf(){
    $(document).ready(function(){
      $(".panel-body").find("input").each(function(){
      this.value="";
      });
      $(".panel-body").find("select").not("select[name=filterIt]").each(function(){
        this.selectedIndex=-1;
        });
    });
    }


  showDefaultData(val) {

    // $("filter_form")[0].reset();
    this.resetf();


    this.filterReport=val;

    switch (val) {
      case "Unschedule Summary By Manager":
        this.showLoader = true;
        this.reportService.getManagerReport1(this.filterValue).subscribe((data) => {
          this.showLoader = false;
          this.showDiv = true;
          this.reports = data;
          console.log(data);
        });
        break;

      case "Unschedule Summary By Employee":
        this.showLoader = true;

        this.reportService.getEmployeeReport1(this.filterValue).subscribe((data) => {
          this.showLoader = false;
          this.showDiv = true;

          this.reports = data;
          console.log(data);
        }); break;

      case "Unschedule Summary By Vendor":
        this.showLoader = true;

        this.reportService.getVendorReport1(this.filterValue).subscribe((data) => {
          this.showLoader = false;
          this.showDiv = true;
          this.reports = data;
          console.log(data);
        }); break;
      case "Unschedule Detail By Vendor":
        this.showLoader = true;

        this.reportService.getVendorReportDetail1(this.filterValue).subscribe((data) => {
          this.showLoader = false;
          this.showDiv = true;
          this.reports = data;
          console.log(data);
        }); break;
      case "Unschedule Detail By Employee":
        this.showLoader = true;

        this.reportService.getEmployeeReportDetail1(this.filterValue).subscribe((data) => {
          this.showLoader = false;
          this.showDiv = true;

          this.reports = data;
          //this.showDiv = true;

          console.log(data);
        }); break;
      case "Unschedule Detail By Manager":
        this.showLoader = true;

        this.reportService.getManagerReportDetail1(this.filterValue).subscribe((data) => {
          this.showLoader = false;
          this.showDiv = true;

          this.reports = data;
          //this.showDiv = true;

          console.log(data);
        }); break;

      case "Checkin Checkout":
        this.showLoader = true;
        this.reportService.getVendorNames().subscribe((data) => {
          this.vname = data;
          this.showDiv = true;

          this.showLoader = false;
          console.log(data);
        });
        
        this.reportService.getCheckinoutDefaultReport().subscribe((data) => {

          this.Checkinoutreport = data;
        });

        
        break;

      case "Vendor Billing Detail":
        this.showLoader = true;
        this.reportService.getVendorNames().subscribe((data) => {
          this.vname = data;
          this.showDiv = true;

          this.showLoader = false;
          console.log(data);
        }); break;

    }

  }



  // Transportation Cost Report ---Start

  //// Stores which fields have been altered by the user....
  altered = {
    toll_regular_cab: false,
    hrtax_regular_cab: false,
    uptax_regular_cab: false,
    emp_contrib_regular: false,
    gps_regular_cab: false,
    gstTax_regular_cab: false,
    emp_contrib_shift: false,
    gps_shift_cab: false,
    gstTax_shift_cab: false,
    hrtax_shift_cab: false,
    uptax_shift_cab: false,
    toll_shift_cab: false,
    toll_unscheduled_cab: false,
    gstTax_unscheduled: false,
    standByCab_extraKms: false,
    ratePerKm: false,
    extraMileageCost: false,
    standByCost: false,
    standByTax: false,
    otherCabCost: false,
    otherCabGST: false,
    escortGuardCost: false,
    escortGuardDropDutyCost: false,
    escortGuardTaxes: false,
    tptMobCost: false,
    overallUPtax: false,
    overallHRtax: false,
    overallTaxes: false,
    overallToll: false,
    overallGPS: false,
    foreignExPrice: false
  };
  //// Initialise formError
  formError = {
    toll_regular_cab: { error: false, message: '' },
    hrtax_regular_cab: { error: false, message: '' },
    uptax_regular_cab: { error: false, message: '' },
    emp_contrib_regular: { error: false, message: '' },
    gps_regular_cab: { error: false, message: '' },
    gstTax_regular_cab: { error: false, message: '' },
    emp_contrib_shift: { error: false, message: '' },
    gps_shift_cab: { error: false, message: '' },
    gstTax_shift_cab: { error: false, message: '' },
    hrtax_shift_cab: { error: false, message: '' },
    uptax_shift_cab: { error: false, message: '' },
    toll_shift_cab: { error: false, message: '' },
    toll_unscheduled_cab: { error: false, message: '' },
    gstTax_unscheduled: { error: false, message: '' },
    standByCab_extraKms: { error: false, message: '' },
    ratePerKm: { error: false, message: '' },
    extraMileageCost: { error: false, message: '' },
    standByCost: { error: false, message: '' },
    standByTax: { error: false, message: '' },
    otherCabCost: { error: false, message: '' },
    otherCabGST: { error: false, message: '' },
    escortGuardCost: { error: false, message: '' },
    escortGuardDropDutyCost: { error: false, message: '' },
    escortGuardTaxes: { error: false, message: '' },
    tptMobCost: { error: false, message: '' },
    overallUPtax: { error: false, message: '' },
    overallHRtax: { error: false, message: '' },
    overallTaxes: { error: false, message: '' },
    overallToll: { error: false, message: '' },
    overallGPS: { error: false, message: '' },
    foreignExPrice: { error: false, message: '' }
  };



  onTptCostForm(f) {


    var d = new Date();
    if ((this.fromMonth >= (d.getMonth() + 1)) || typeof this.fromMonth == "undefined") {
      alert("Cannot show report until this month is complete.");
      return;
    }

    // if (this.validate()) {
      this.showLoader = true;
      this.reportService.getTransportationReport(this.fromMonth, this.year, f).subscribe((data) => {
        console.log(data);
        this.showLoader = false;
        this.transBillReport = data;
        this.showTransportationReportResult = true;
        this.showDiv = false;
      });

    // }

  }

  validate() {
   var flag=false;

    for(var property in this.altered )
    {
      if(this.altered[property]){
        // console.log(">>"+JSON.stringify(property)+" >>"+this.altered[property]);
        flag=true;
        break;
      }
    }

    if(flag)
    {
      return false;
    }


  }

  // refreshErrorValues(){
  //   this.formError.empQlid.error          = false;
  //   this.formError.empFName.error         = false;
  //   this.formError.empMName.error         = false;
  //   this.formError.empLName.error         = false;
  //   this.formError.empMobNbr.error        = false;
  //   this.formError.empGender.error        = false;
  //   this.formError.rolesId.error          = false;
  //   this.formError.empMgrQlid1.error      = false;
  //   this.formError.empMgrQlid2.error      = false;
  //   this.formError.empAddLine1.error      = false;
  //   this.formError.empAddLine2.error      = false;
  //   this.formError.empZone.error          = false;
  //   this.formError.empPin.error           = false;
  //   this.formError.empPickupArea.error    = false;
  //   this.formError.empHomeNbr.error       = false;
  //   this.formError.empEmergNbr.error      = false;
  //   this.formError.empBloodGrp.error      = false;

  //   this.formError.empQlid.message        = '';
  //   this.formError.empFName.message       = '';
  //   this.formError.empMName.message       = '';
  //   this.formError.empLName.message       = '';
  //   this.formError.empMobNbr.message      = '';
  //   this.formError.empGender.message      = '';
  //   this.formError.rolesId.message        = '';
  //   this.formError.empMgrQlid1.message    = '';
  //   this.formError.empMgrQlid2.message    = '';
  //   this.formError.empAddLine1.message    = '';
  //   this.formError.empAddLine2.message    = '';
  //   this.formError.empZone.message        = '';
  //   this.formError.empPin.message         = '';
  //   this.formError.empPickupArea.message  = '';
  //   this.formError.empHomeNbr.message     = '';
  //   this.formError.empEmergNbr.message    = '';
  //   this.formError.empBloodGrp.message    = '';
  // }

  // resetForm(){
  //   // this.refreshErrorValues();
  //   this.transportationCost.        = '';
  //   this.emp.empFName       = '';
  //   this.emp.empMName       = '';
  //   this.emp.empLName       = '';
  //   this.emp.empMobNbr      = '';
  //   this.emp.empGender      = '';
  //   this.emp.rolesId        = '';
  //   this.emp.empMgrQlid1    = '';
  //   this.emp.empMgrQlid2    = '';
  //   this.emp.empAddLine1    = '';
  //   this.emp.empAddLine2    = '';
  //   this.emp.empZone        = '';
  //   this.emp.empPin         = '';
  //   this.emp.empPickupArea  = '';
  //   this.emp.empHomeNbr     = '';
  //   this.emp.empEmergNbr    = '';
  //   this.emp.empBloodGrp    = '';
  // }

  // resetAltered(){
  //   this.altered.hrtax_regular_cab = false;
  //   this.altered.empFName = false;
  //   this.altered.empMName = false;
  //   this.altered.empLName = false;
  //   this.altered.empMobNbr = false;
  //   this.altered.empGender = false;
  //   this.altered.rolesId = false;
  //   this.altered.empMgrQlid1 = false;
  //   this.altered.empMgrQlid2 = false;
  //   this.altered.empAddLine1 = false;
  //   this.altered.empAddLine2 = false;
  //   this.altered.empZone = false;
  //   this.altered.empPin = false;
  //   this.altered.empPickupArea = false;
  //   this.altered.empHomeNbr = false;
  //   this.altered.empEmergNbr = false;
  //   this.altered.empBloodGrp = false;
  // }


  // Transportation Cost Report ---END




  // Checkin Checkout and Vendor Billing Summary Report -----Start
  
  getdata(f) {


    if (typeof this.modelf === 'undefined')
      this.fdate = "";

    else if (this.modelf == null)
      this.fdate = "";
    else
      this.fdate = this.modelf.formatted;

    if (typeof this.modelt === 'undefined')
      this.tdate = "";
    else if (this.modelt == null)
      this.tdate = "";

    else
      this.tdate = this.modelt.formatted;

    var valarr = [f.RouteNo, this.fdate, this.tdate, f.CabNo, this.EmpName, f.VendorName];

    for (var x in valarr)
      if (typeof valarr[x] === 'undefined')
        valarr[x] = "";

    var emp_fname = "";
    var emp_lname = "";

    if (valarr[4] != "") {
      var arr = valarr[4].split(" ");
      emp_fname = arr[0];
      emp_lname = arr[1];
    }

    this.reportService.getCheckinoutreport(valarr[0], valarr[1], valarr[2], valarr[3], emp_fname, emp_lname, valarr[5]).subscribe
      ((data) => {
        this.Checkinoutreport = data;

        console.log("in subscribe()" + data);

      });
  }

  
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
  };


  enableshift() {
    $("select[name=ShiftType]").prop("disabled", false);
  }

  enablefrom(value) {
    $("select[name=FromDate]").prop("disabled", false);
    this.shiftValue = value;
  }

  enableto(value) {
    $("select[name=ToDate]").prop("disabled", false);
    this.fromDate = value;
  }

  enablego(value) {
    $("button[name=FinalGo]").prop("disabled", false);
    this.toDate = value;
  }

  //to get route no vendor
  getRouteNosbyVendor(f) {
    this.reportService.getRouteNos(f.value.VendorName).subscribe((data) => {
      this.rname = data;
    })
  }

  // to get cab no by vendor and route no
  getCabnobyVendorandRouteNo(f) {
    if (typeof f.value.RouteNo === 'undefined')
    return;
    else
   this.reportService.getCabnobyVendorandRouteNo(f.value.VendorName,f.value.RouteNo).subscribe((data ) =>{
      this.cno=data;
    }  )
  
  }
 

  // Checkin Checkout and Vendor Billing Summary Report -----End


}


