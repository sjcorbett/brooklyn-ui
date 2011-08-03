Brooklyn.summary = (function() {
    // State
    var entity_id;

    function handleSummaryData(json) {
        var name_html = '<p><span class="label">Name:</span> ' + json.displayName + "</p>";
        var locations_html = '<h4>Locations</h4>';
        if (json.locations.length > 0) {
            locations_html += '<ul id="#summary-locations">\n';
            for (l in json.locations){
                locations_html += "<li>"+json.locations[l].displayName+"</li>\n";
            }
            locations_html += "</ul>";
        } else {
            locations_html += "None set";
        }
        //alert(locations_html)
        $("#summary-basic-info").html(name_html + locations_html) ;

        var status_html = '<span class="label">Status: </span>TODO';
        $("#summary-status").html(status_html);

        var groups_html = '<h4>Groups</h4>';
        if (json.groupNames.length > 0) {
            groups_html += '<ul>\n<li>';
            groups_html += json.groupNames.join("</li>\n<li>");
            groups_html += "</ul>";
        } else {
            groups_html += "None";
        }
        $("#summary-groups").html(groups_html);

        var activity_html = '<h4>Recent Activity</h4>';
        activity_html += '<p>TODO</p>';
        $("#summary-activity").html(activity_html);
    }

    function update() {
        if (typeof entity_id !== 'undefined') {
            $.getJSON("../entity/info?id=" + entity_id, handleSummaryData).error(
                function() {$(Brooklyn.eventBus).trigger('update_failed', "Could not get entity info to show in summary.");});
        }
    }

    /* This method is intended to be called as an event handler. The e paramater is
     * unused.
     */
    function setEntityIdAndUpdate(e, id) {
        entity_id = id;
        update();
    }

    function init() {
        $(Brooklyn.eventBus).bind("entity_selected", setEntityIdAndUpdate);
        $(Brooklyn.eventBus).bind("update", update);
    }

    return {
        init: init
    };

})();

$(document).ready(Brooklyn.summary.init);
