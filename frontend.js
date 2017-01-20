"use strict";

Widget.register("rwa-timedcommands", function (widget) {

    var form = widget.template(".form");
    var dataTable = widget.template(".data-table");

    var updateScripts = function () {
        widget.backend("get", null, function (commands) {
            dataTable.find("tbody").html('');
            for (var commandsIndex in commands) {
                if (commands.hasOwnProperty(commandsIndex)) {
                    var row = commands[commandsIndex];
                    var tr = $('<tr>');
                    tr.attr("data-name", row.name);
                    tr.append($('<td>').text(row.name));
                    tr.append($('<td>').text(t(row.active)));
                    tr.append($('<td>').html(
                        '<span class="btn btn-info edit">' + widget.t("edit") + '</span> ' +
                        '<span class="btn btn-danger delete">' + widget.t("delete") + '</span>'
                    ));
                    dataTable.find("tbody").append(tr);
                }
            }
        });
    };

    /**
     * On initialization
     */
    widget.onInit = function () {
        widget.content.append(form);
        widget.content.append(dataTable);

        var i = 0;
        var select = widget.content.find("select[name='minutes']");
        for (i = 0; i <= 59; i++) {
            select.append($('<option>').attr("value", i).text(i));
        }

        select = widget.content.find("select[name='hours']");
        for (i = 0; i <= 23; i++) {
            select.append($('<option>').attr("value", i).text(i));
        }

        select = widget.content.find("select[name='weekdays']");
        for (i = 0; i <= 6; i++) {
            select.append($('<option>').attr("value", i).text(widget.t("weekday." + i)));
        }

        widget.content.find(".selectpicker").selectpicker();
        updateScripts();
        collapsable(widget.content);

        widget.content.on("click", ".save", function () {
            var f = $(this).closest("form");
            var name = f.attr("name");
            if (f[0].checkValidity()) {
                var data = {};
                f.find(":input").filter("[name]").each(function () {
                    if ($(this).closest(".dropdown-toggle, .dropdown-menu").length) return true;
                    data[$(this).attr("name")] = $(this).val();
                });
                if (data.name && data.name.length) {
                    widget.backend("save", data, function (messageData) {
                        note(widget.t("saved"), "success");
                        updateScripts();
                    });
                }
            } else {
                // on validation error trigger a fake submit button to enable validation UI popup
                $(this).after('<input type="submit">');
                $(this).next().trigger("click").remove();
            }
        }).on("click", ".edit", function () {
            var e = $(this);
            widget.backend("get", null, function (commands) {
                widget.content.find("h2.collapsed.collapsable-trigger[data-collapsable-target='timedcommands.form']").trigger("click");
                window.scrollTo(0, form.offset().top);
                var name = e.closest("tr").attr("data-name");
                if (typeof commands[name] != "undefined") {
                    populateForm(form.find("form"), commands[name]);
                    widget.content.find(".selectpicker").selectpicker("refresh");
                }
            });
        }).on("click", ".delete", function () {
            var e = $(this);
            widget.backend("get", null, function (commands) {
                var name = e.closest("tr").attr("data-name");
                if (typeof commands[name] != "undefined") {
                    Modal.confirm(widget.t("sure"), function (success) {
                        if (success) {
                            widget.backend("delete", name);
                            note(widget.t("deleted"), "success");
                            updateScripts();
                        }
                    })
                }
            });
        });
    };
});