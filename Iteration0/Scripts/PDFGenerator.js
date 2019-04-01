/// <reference path="jquery.d.ts" />
/// <reference path="jspdf.d.ts" />
//
//      PDFGenerator
// 
var PDFGenerator = /** @class */ (function () {
    function PDFGenerator(document, jsPDF) {
        this.buttonIDOK = ".app_pop_up_okbtn";
        this.buttonIDCancel = ".app_pop_up_cancelbtn";
        this.buttonHtmlOK = '<input class="app_pop_up_okbtn" type="button" value="OK"  />';
        this.buttonHtmlCancel = ' &nbsp; <input class="app_pop_up_cancelbtn" type="button" value="Cancel"  />';
        this.popUpTemplate = '<div id="app_pop_up###" style="z-index:###;" class="popup-message"><div><div class="pop_up_title"></div><div style="background:#fcc;"><div class="pop_up_message_title"></div><div class="pop_up_message"></div></div><div class="pop_up_content_holder"></div><div class="pop_up_buttons"></div></div></div>';
        this.docVM = document;
        this.pdf = jsPDF;
        //this.wrapperID = '#app_pop_up' + zIndex.toString();  
    }
    PDFGenerator.prototype.Download = function () {
        var totalPagesExp = "{total_pages_count_string}";
        this.pdf.setFillColor(128, 128, 128);
        this.pdf.setDrawColor(128, 128, 128);
        this.pdf.setLineWidth(1);
        this.pdf.setFontSize(14);
        this.pdf.text(this.docVM.Title, 220, 60);
        this.pdf.setFontSize(11);
        this.pdf.text(this.docVM.SubTitle, 40, 90);
        //this.pdf.putTotalPages(totalPagesExp);
        var row = 300;
        var context = this;
        jQuery.each(this.docVM.Content, function () {
            context.pdf.text(this.Header1, 40, row);
            row += 100;
            context.pdf.text(this.Header2, 40, row);
            row += 100;
            context.pdf.text(this.Header3, 40, row);
            row += 100;
            context.pdf.text(this.Content, 40, row);
            row += 100;
        });
        var margins = { top: 80, bottom: 60, left: 40, width: 522 };
        //this.pdf.fromHTML(source, 15, 15, { 'width': 170});
        this.pdf.save(this.docVM.FileName + '.pdf');
    };
    return PDFGenerator;
}());
// all coords and widths are in jsPDF instance's declared units
// 'inches' in this case
//pdf.fromHTML(
//    source, // HTML string or DOM elem ref.
//    margins.left, // x coord
//    margins.top, { // y coord
//        'width': margins.width, // max width of content on PDF
//        'elementHandlers': specialElementHandlers
//    },
//    function (dispose) {
//        // dispose: object with X, Y of the last line add to the PDF
//        //          this allow the insertion of new lines after html
//        pdf.save('Test.pdf');
//    }, margins);
//var doc = new jsPDF('p', 'pt', 'a4');
//    var elem = document.getElementById('example');
//    var data = doc.autoTableHtmlToJson(elem);
//    doc.autoTable(data.columns, data.rows, {
//        tableLineColor: [189, 195, 199],
//        tableLineWidth: 0.75,
//        styles: {
//            font: 'Meta',
//            lineColor: [44, 62, 80],
//            lineWidth: 0.55
//        },
//        headerStyles: {
//            fillColor: [0, 0, 0],
//            fontSize: 11
//        },
//        bodyStyles: {
//            fillColor: [216, 216, 216],
//            textColor: 50
//        },
//        alternateRowStyles: {
//            fillColor: [250, 250, 250]
//        },
//        startY: 100,
//        drawRow: function (row, data) {
//            // Colspan
//            doc.setFontStyle('bold');
//            doc.setFontSize(10);
//            if ($(row.raw[0]).hasClass("innerHeader")) {
//                doc.setTextColor(200, 0, 0);
//                doc.setFillColor(110, 214, 84);
//                doc.rect(data.settings.margin.left, row.y, data.table.width, 20, 'F');
//                doc.autoTableText("", data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
//                    halign: 'center',
//                    valign: 'middle'
//                });
//                /*  data.cursor.y += 20; */
//            };
//            if (row.index % 5 === 0) {
//                var posY = row.y + row.height * 6 + data.settings.margin.bottom;
//                if (posY > doc.internal.pageSize.height) {
//                    data.addPage();
//                }
//            }
//        },
//        drawCell: function (cell, data) {
//            // Rowspan
//            console.log(cell);
//            if ($(cell.raw).hasClass("innerHeader")) {
//                doc.setTextColor(200, 0, 0);
//                doc.autoTableText(cell.text + '', data.settings.margin.left + data.table.width / 2, data.row.y + data.row.height / 2, {
//                    halign: 'center',
//                    valign: 'middle'
//                });
//                return false;
//            }
//        }
//    });
//    doc.save(fileName + ".pdf");
//}
//# sourceMappingURL=PDFGenerator.js.map