/*global showAlert*/

function checkbox_selection () {
    $("#alignment_table > tbody > tr").click(function(event) {
        if (event.target.type !== "checkbox") {
            $(":checkbox", this).trigger("click");
            $(this).eq(0).toggleClass("alt_selected");
        }
        $(this).eq(0).toggleClass("alt_selected");
    });

    $("#select-all").click(function() {
        $(":checkbox", this).trigger("click");
        if ($(this).prop("checked")===true) {
            $(".alt:visible").prop("checked", true);
            $(".alt:visible").parent().parent().addClass("alt_selected");
        }
        if ($(this).prop("checked")===false) {
            $(".alt:visible").prop("checked", false);
            $(".alt:visible").parent().parent().removeClass("alt_selected");
        }
    });
}

function alignment_download () {
    $("#alignment_download_button").click(function() {
        var dataCSV = '';
        if ($(".alt_selected").length===0 || ($(".alt_selected").length===1 & $("#select-all").parent().parent().hasClass("alt_selected"))) {
            showAlert("No entries selected", "danger");
        }
        else {
            $("#alignment_table tr").each(function() {
                if ($(this).is(':first-child') || $(this).hasClass("alt_selected")) {
                    $(this).find("th").each(function(key, cell) {
                        dataCSV += $(cell).text()+",".repeat($(cell).prop("colSpan"));
                    })
                    $(this).find("td").each(function(key, cell) {
                        dataCSV += $(cell).text()+",";
                    })
                    dataCSV += "\n";
                }
            })
            dataCSV += consensus_symbols("#alignment_table");
            var hiddenElement = document.createElement('a');  
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(dataCSV);  
            hiddenElement.target = '_blank';  
            hiddenElement.download = 'SH2DB_alignment.csv';  
            hiddenElement.click();
        }
    });
}

function mutation_symbols (table_id, domain) {
    var array = transposed_table(table_id, domain)
    var mutation_symbols = "<tr>";
    $(array).each(function(nums, vals) {
        if (vals.length<2 || (vals.includes("-") && vals.length==2) ) {
            mutation_symbols+= "<td></td>";
        }
        else {
             mutation_symbols+= "<td class='mutation'>*</td>";
        }
    })
    mutation_symbols+="</tr>"
    $(table_id + " tr." + domain + ":last").after(mutation_symbols);
}

function transposed_table (table_id, target_class) {
    var dataArray = [];
    $(table_id + " tr").each(function() {
        if ($(this).hasClass(target_class)) {
            var dataRow = [];
            $(this).find("td").each(function(key, cell) {
                dataRow.push($(cell).text());
            })
            dataArray.push(dataRow);
        }
    })
    if (dataArray.length===0) {
        return []
    }
    var transposedArray = [];
    for (var i=0; i<dataArray[0].length; i++) {
        var row = [];
        for (var j=0; j<dataArray.length; j++) {
            if (dataArray[j][i].length==1 && !row.includes(dataArray[j][i])) {
                row.push(dataArray[j][i]);
            }
        }
        transposedArray.push(row);
    }
    return transposedArray
}

function consensus_symbols (table_id) {
    var transposedArray = transposed_table (table_id, "alt_selected")
    var consensus_symbols = "";
    
    $(transposedArray).each(function(nums, vals) {
        skiprow = false;
        gap = false;
        var symbol = "";
        if (vals.length==1 && vals[0]!="-") {
            consensus_symbols += "*,";
        }
        else {
            if (vals.includes("-") || vals.length==0) {
                consensus_symbols += ",";
            }
            else {
                consensus_symbols += find_consensus_set(vals) + ",";
            }
        }
    })
    return consensus_symbols;
}

function find_consensus_set (array) {
    var colon_sets = [["S", "T", "A"],
                      ["N", "E", "Q", "K"],
                      ["N", "H", "Q", "K"],
                      ["N", "D", "E", "Q"],
                      ["Q", "H", "R", "K"],
                      ["M", "I", "L", "V"],
                      ["M", "I", "L", "F"],
                      ["H", "Y"],
                      ["F", "Y", "W"]];
    var dot_sets = [["C", "S", "A"],
                    ["A", "T", "V"],
                    ["S", "A", "G"],
                    ["S", "T", "N", "K"],
                    ["S", "T", "P", "A"],
                    ["S", "G", "N", "D"],
                    ["S", "N", "D", "E", "Q", "K"],
                    ["N", "D", "E", "Q", "H", "K"],
                    ["N", "E", "Q", "H", "R", "K"],
                    ["F", "V", "L", "I", "M"],
                    ["H", "F", "Y"]];
    
    for (j=0; j<colon_sets.length; j++) {
        var present = false;
        for (i=0; i<array.length; i++) {
            if (!colon_sets[j].includes(array[i])) {
                present = false;
                break;
            }
            else {
                present = true;
            }
        }
        if (present) {
            return ":";
        }
    }
    for (j=0; j<dot_sets.length; j++) {
        var present = false;
        for (i=0; i<array.length; i++) {
            if (!dot_sets[j].includes(array[i])) {
                present = false;
                break;
            }
            else {
                present = true;
            }
        }
        if (present) {
            return ".";
        }
    }
    return "";
}

function structure_download () {
    $("#structure_download_button").click(function() {
        var structures = [];
        if ($(".structure.alt_selected").length===0) {
            showAlert("No structure entries selected", "danger");
        }
        else {
            $(".structure.alt_selected").each(function() {
                structures.push($(":nth-child(3)", this).text());
            });
            // StructureDownload(structures.join(','));
            window.location.href = '/structure/download?ids='+structures.join(",");
        }
    });
}

function pymol_download () {
    $("#pymol_download_button").click(function() {
        var structures = [];
        var residues = [];
        if ($(".structure.alt_selected").length===0) {
            showAlert("No structure entries selected", "danger");
        }
        else if ($(".residue_checkbox :checkbox:checked").length===0) {
            showAlert("No residues selected", "danger");
        }

        else {
            $(".structure.alt_selected").each(function() {
                structures.push($(":nth-child(3)", this).text());
            });
            $(".residue_checkbox :checkbox:checked").each(function() {
                residues.push($(this).attr('id'));
            });
            // PymolDownload(structures.join(','));
            window.location.href = '/structure/pymoldownload?ids='+structures.join(",")+'&residues='+residues.join(",");
        }
    });
}

function StructureDownload (structures) {
    $.ajax({
        'url': '/structure/download',
        'data': {"structures": structures},
        'type': 'GET',
        'success': function(response) {},
        'error': function(response) {}
    });
}

function table_filter () {
    fill_filter(".protein", "#protein_filter");
    fill_filter(".domain", "#domain_filter");
    for (var i=1; i<$(".data-row:first > .residue").length+1; i++) {
        fill_filter(".res_"+i.toString(), "#filter_"+i.toString())
    }
    run_filter();
}

function run_filter () {
    $("select").change(function() {
        var selected = $(this).find(":selected").text();
        if ($(this).attr("id")==="protein_filter")  {
            var column = $(".protein");
        }
        else if ($(this).attr("id")==="domain_filter") {
            var column = $(".domain");
        }
        else {
            var column = $(".res_"+$(this).attr("id").split("_")[1]);
        }
        $(column).each(function (key, val) {
            if (selected.toString()!==$(val).text()) {
                $(this).parent().hide();
            }
            if (selected.toString()==="") {
                if ($("#structure_toggle_button").hasClass("left_position")) {
                    if (!$(this).parent().hasClass("structure")) {
                        $(this).parent().show();
                    }
                }
                else {
                    $(this).parent().show();
                }
            }
        })
    });
}

function fill_filter (td_class, filter_id) {
    var options = [];
    $(td_class).each(function (key, val) {
        if (!options.includes(val.innerHTML)) {
            options.push(val.innerHTML);
        }
    });
    $(filter_id).append(`<option value=""></option>`)
    $(options).each(function (key, val) {
        $(filter_id).append(`<option value="${val}">${val}</option>`);
    });
}