/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>

//
//      AnalysisMatrixUIControl
//
class AnalysisMatrixUIControl extends RequirementUIControl {
    matrix: AnalysisMatrixViewModel;

    constructor(formVM: AnalysisMatrixViewModel, defaultVersionID: number = 0) {
        super("AnalysisMatrixUIControl", "#matrix");
        this.ProjectID = formVM.ProjectID;  
        this.matrix = formVM;
        this.Start(defaultVersionID);
    }
    public Start(defaultVersionID: number = 0) {
        this.Build(defaultVersionID);
    }
    public Build(defaultVersionID: number = 0) {
        if (this.wrapper.length > 0) {
            this.BuildViewFilter(); $("#formVersions").val(defaultVersionID.toString());
            $('#formProducts, #formVersionEnum, #formVersions').change((e => { this.UpdateMatrix(); }));
            this.BuilAlternativeFilter();
            $('.alternatives-CB').click((e => { this.UpdateMatrix() }));
            this.UpdateMatrix();
        }
    }
    public BuildViewFilter() {
        var Context = this;
        var html = '';
        this.matrix.ProjectProducts.push(new ItemViewModel("[ ALL PRODUCTS ]", "0"));
        VersionStatusOptions.push(new ItemViewModel("[ ALL STATUS ]", "0"));
        this.matrix.ProjecVersions.push(new ItemViewModel("[ NO VERSION ]", "-1"));
        this.matrix.ProjecVersions.push(new ItemViewModel("[ ALL VERSIONS ]", "0"));
        html += "<span class='filter-selector'>" + this.BuildDropDownHtmlWith("formProducts", this.matrix.ProjectProducts, "Select Product", "0") + "</span>";
        html += "<span class='filter-selector'>" + this.BuildDropDownHtmlWith("formVersionEnum", VersionStatusOptions, "Select Status", "0") + "</span>";
        html += "<span id='version-filter-wrapper' class='filter-selector'>" + this.BuildDropDownHtmlWith("formVersions", this.matrix.ProjecVersions, "Select Version", "0") + "</span>";
        $("#matrix-view-filter").html("<label class='fmax'>&nbsp;View :&nbsp; </h2></label>" + html);
    }
    public BuilAlternativeFilter() {
        var html = '<div class="variants-dropdown dropdown"><button class="max">Scope ▾</button><div class="dropdown-content">';
        jQuery.each(this.matrix.ProductAlternatives, function () {
            //console.log(this.Contexts.length);
            html += "<div><input type='checkbox' class='alternatives-CB i' CBId='" + this.ScopeIDs.join("_") + "'>" + this.ScopeSummary + "</div>";
        });
        html += '</div></div>';
        $("#matrix-alternatives-filter").html(html);
    }
    public UpdateMatrix() {
        var filterAlternativeIDs = [];
        jQuery.each($('.alternatives-CB:checked'), function () {
            filterAlternativeIDs.push($(this).attr('CBId'));
        });
        var filterAlternatives = [];
        jQuery.each(this.matrix.ProductAlternatives, function () {
            if (filterAlternativeIDs.length == 0 || filterAlternativeIDs.indexOf(this.ScopeIDs.join("_")) > -1) filterAlternatives.push(this);
        });
        var versionId = $("#formVersions").val();
        if (versionId == 'undefined') { versionId = '0'; $("#formVersions").val(versionId);}
        var selectedVersion = []; var selectableVersion = [];
        var versionEnum = $("#formVersionEnum").val(); var productId = $("#formProducts").val();
        if (versionId == '0') {
            jQuery.each(this.matrix.ProjecVersions, function () {
                if (((productId == '0' || productId == this.ParentKeyValue) && (versionEnum == '0' || versionEnum == this.Code)) || (this.KeyValue == "0") || (this.KeyValue == "-1")) { selectableVersion.push(this); selectedVersion.push(this); }
            });
        } else {
            jQuery.each(this.matrix.ProjecVersions, function () {
                if (versionId == this.KeyValue) { selectedVersion.push(this); }
                if (((productId == '0' || productId == this.ParentKeyValue) && (versionEnum == '0' || versionEnum == this.Code)) || (this.KeyValue == "0") || (this.KeyValue == "-1")) { selectableVersion.push(this); }
            });
        }
        var filterAltRequirementDefaultIDs = [];
        jQuery.each(this.matrix.ProductAlternatives, function () {
            jQuery.each(this.AlternativeRequirements, function () {
                var requirement = this;
                jQuery.each(selectedVersion, function () {
                    if (requirement.SelectedVersionIDs.indexOf(parseInt(this.KeyValue)) > -1) {
                        if (filterAltRequirementDefaultIDs.indexOf(requirement.DefaultBehaviorID) == -1) filterAltRequirementDefaultIDs.push(requirement.DefaultBehaviorID);
                        return false;
                    }
                });
            });
        });
        var filterRequirements = [];
        jQuery.each(this.matrix.DefaultRequirements, function () {
            var requirement = this;
            jQuery.each(selectedVersion, function () {
                if ((filterAltRequirementDefaultIDs.indexOf(requirement.RequirementID) > -1) || (requirement.SelectedVersionIDs.indexOf(parseInt(this.KeyValue)) > -1)) {
                    filterRequirements.push(requirement); return false;
                }
            });
        });
        if ((versionId == '-1') || (versionId == '0')) { //NONE OR ALL
            jQuery.each(this.matrix.DefaultRequirements, function () {
                if (this.SelectedVersionIDs.length == 0) { filterRequirements.push(this); }
            });
        } 
        $("#version-filter-wrapper").html(this.BuildDropDownHtmlWith("formVersions", selectableVersion, "Select Version", versionId));
        $('#formVersions').change((e => { this.UpdateMatrix(); }));
        this.BuildMatrixFor(filterRequirements, filterAlternatives); 
    }
    public BuildMatrixFor(requirements: Array<RequirementViewModel>, alternatives: Array<ProductAlternativeViewModel>) {        
        var Context = this;
        var html = ''; 
        if (requirements.length > 0) {
            var html = '<thead><tr><th>Default Behavior</th>';
            var dataFound = false;
            jQuery.each(alternatives, function () {
                html += '<th>' + this.ScopeSummary + '</th>';
            });
            html += '</tr></thead><tbody>';
            var alternativeHtml = "";
            jQuery.each(requirements, function () {
                var rowHtml = '<tr><td><div class="req-tag"><a href="/Project/UseCaseEditor?FunctionID=' + this.UseCaseID + '#r' + this.RequirementID + '"># ' + this.RequirementID + '</a></div>' + this.Behavior +'</td>';
                var defaultID = this.RequirementID; var dataFound = false;
                    jQuery.each(alternatives, function () {
                        var requirementAlternatives = this.AlternativeRequirements.filter(function (el) { return el.DefaultBehaviorID == defaultID; });
                        if (requirementAlternatives.length > 0) {
                            rowHtml += '<td>' + requirementAlternatives[0].Behavior + '</td>'; dataFound = true;//TODO add priority
                        } else {
                            rowHtml += '<td></td>';
                        }
                    });
                    rowHtml += '</tr>';
                    if (dataFound) alternativeHtml += rowHtml;//We keep only rows with alternatives data
            });
            if (alternativeHtml.length == 0) alternativeHtml = '<tr><td colspan="' + alternatives.length + '">No Alternative Behaviors</td></tr>';
            html += alternativeHtml + '</tbody>';
        } else {
                html = '<tr><td>No Default Behaviors</td></tr>';
        }
        $("#matrix-view").html(html);
    }
}
