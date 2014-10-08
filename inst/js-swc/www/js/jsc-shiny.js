$(function() {

  function ShinyController() {
    this.end = null;
    this.start = null;
    this._bind();
  }
  ShinyController.prototype.on = function() {
    return $.fn.on.apply($(this), arguments);
  };

  ShinyController.prototype.off = function() {
    return $.fn.off.apply($(this), arguments);
  };

  ShinyController.prototype.trigger = function() {
    return $.fn.trigger.apply($(this), arguments);
  };

  ShinyController.prototype.getTimeStart = function() {
    return this.start;
  };

  ShinyController.prototype.getTimeEnd = function() {
    return this.end;
  };

  ShinyController.prototype.getTimeseries = function() {
    var timeseries = [];
    $.each(TimeSeriesController.getTimeseriesCollection(), function(id, ts) {
      timeseries.push(ts.getApiUrl() + ts.getTsId());
    });
    return timeseries;
  };

  ShinyController.prototype._bind = function() {
    EventManager.subscribe("time:end:change", $.proxy(this, "_onTimeEndChange"));
    EventManager.subscribe("time:start:change", $.proxy(this, "_onTimeStartChange"));
    EventManager.subscribe("timeextent:change", $.proxy(this, "_onTimeExtentChange"));
    EventManager.subscribe("timeseries:add", $.proxy(this, "_onTimeSeriesAdd"));
    EventManager.subscribe("timeseries:remove", $.proxy(this, "_onTimeSeriesRemove"));
    EventManager.subscribe("timeseries:removeAll", $.proxy(this, "_onTimeSeriesRemoveAll"));
  };

  ShinyController.prototype._onTimeEndChange = function(e, end) {
    /* undefined would create a moment() for the current time */
    end = moment(end === undefined ? null : end);
    if (!end.isValid()) {
      if (this.end && this.end.isValid()) {
        this.end = null;
        this.trigger("change:time:end");
      }
    } else if (!this.end ||
               !this.end.isValid() ||
               !this.end.isSame(end)) {
      this.end = end;
      this.trigger("change:time:end");
    }
  };

  ShinyController.prototype._onTimeStartChange = function(e, start) {
    /* undefined would create a moment() for the current time */
    start = moment(start === undefined ? null : start);
    if (!start.isValid()) {
      if (this.start && this.start.isValid()) {
        this.start = null;
        this.trigger("change:time:start");
      }
    } else if (!this.start ||
               !this.start.isValid() ||
               !this.start.isSame(start)) {
      this.start = start;
      this.trigger("change:time:start");
    }
  };

  ShinyController.prototype._onTimeExtentChange = function(e, extent) {
    this._onTimeStartChange(e, extent.from);
    this._onTimeEndChange(e, extent.till);
  };

  ShinyController.prototype._onTimeSeriesAdd = function() {
    this.trigger("change:timeseries");
  };

  ShinyController.prototype._onTimeSeriesRemove = function() {
    this.trigger("change:timeseries");
  };

  ShinyController.prototype._onTimeSeriesRemoveAll = function() {
    this.trigger("change:timeseries");
  };

  function ReadOnlyInputBinding() {
    Shiny.InputBinding.call(this);
  }

  ReadOnlyInputBinding.prototype = Object.create(Shiny.InputBinding.prototype);

  ReadOnlyInputBinding.prototype.getId = function(el) {
    var $el = $(el);
    return $el.data("input-id") || $el.data("id") || $el.attr("id");
  };

  ReadOnlyInputBinding.prototype.setValue = function(el, value) {
    //NOT IMPLEMENTED
  };

  function SWCInputBinding(ctrl, selector, event) {
    this.ctrl = ctrl;
    this.selector = selector;
    this.event = event;
  }

  SWCInputBinding.prototype = Object.create(ReadOnlyInputBinding.prototype);

  SWCInputBinding.prototype.find = function(scope) {
    return $(scope).find(this.selector);
  };

  SWCInputBinding.prototype.subscribe = function(el, callback) {
    this.ctrl.on(this.event, function() {
      /* the values are beeing set _AFTER_ the event is published,
       * so defer the callback to later */
      setTimeout(function() { callback(true); }, 0);
    });
  };

  SWCInputBinding.prototype.unsubscribe = function(el) {
    this.ctrl.off(this.event);
  };


  function TimeInputBinding(ctrl, selector, event) {
    SWCInputBinding.call(this, ctrl, selector, event);
  }

  TimeInputBinding.prototype = Object.create(SWCInputBinding.prototype);

  TimeInputBinding.prototype.getType = function() {
    return "n52.datetime";
  };

  TimeInputBinding.prototype.getValue = function(el) {
    var start = this._getValueAsMoment();
    return start && start.isValid() ? start.toDate() : null;
  };

  TimeInputBinding.prototype._getValueAsMoment = function() {
    throw new Error("Abstract");
  };

  function TimeStartInputBinding(ctrl) {
    TimeInputBinding.call(this, ctrl, "input.jsc-time-start", "change:time:start");
  }

  TimeStartInputBinding.prototype = Object.create(TimeInputBinding.prototype);

  TimeStartInputBinding.prototype._getValueAsMoment = function() {
    return this.ctrl.getTimeStart();
  };

  function TimeEndInputBinding(ctrl) {
    TimeInputBinding.call(this, ctrl, "input.jsc-time-end", "change:time:end");
  }

  TimeEndInputBinding.prototype = Object.create(TimeInputBinding.prototype);

  TimeEndInputBinding.prototype._getValueAsMoment = function() {
    return this.ctrl.getTimeEnd();
  };

  function TimeseriesInputBinding(ctrl) {
    SWCInputBinding.call(this, ctrl, "input.jsc-timeseries", "change:timeseries");
  }

  TimeseriesInputBinding.prototype = Object.create(SWCInputBinding.prototype);

  TimeseriesInputBinding.prototype.getValue = function(el) {
    return this.ctrl.getTimeseries();
  };

  var controller = new ShinyController();

  var timeStart = new TimeStartInputBinding(controller);
  Shiny.inputBindings.register(timeStart, "n52.swc.timestart");

  var timeEnd = new TimeEndInputBinding(controller);
  Shiny.inputBindings.register(timeEnd, "n52.swc.timeend");

  var timeSeries = new TimeseriesInputBinding(controller);
  Shiny.inputBindings.register(timeSeries, "n52.swc.timeseries");

  (function() {

    i18n.de.main.analysisView = 'Analyse';
    i18n.en.main.analysisView = 'Analysis';

    Pages.navigateToStatistics = function() {
      Pages.navigateToPage("#analysis-page");
      location.href = "#analysis";
      Pages.togglePhenomenon(false);
      Pages.toggleLegend(false);
    };

    Pages.toggleAnalysisSidebar = function(active) {
      var $pane = $("#analysis-sidebar"),
          $btn = $('[data-toggle="#analysis-sidebar"');
      if (active === undefined) {
        active = !$pane.hasClass("active");
      }
      $pane.toggleClass("active", active);
      $btn.text(active ? "X" : $btn.data("title"));
    };

    /* let's patch :) */
    Pages._routeToPage = (function(orig){
      return function(hash) {
        if (hash === "#analysis") {
          Pages.navigateToStatistics();
        } else {
          return orig.apply(this, arguments);
        }
      };
    })(Pages._routeToPage);

    Pages.navigateToMap = (function(orig) {
      return function() {
        Pages.toggleAnalysisSidebar(false);
        orig.apply(this, arguments);
      };
    })(Pages.navigateToMap);

    Pages.navigateToChart = (function(orig) {
      return function() {
        Pages.toggleAnalysisSidebar(false);
        orig.apply(this, arguments);
      };
    })(Pages.navigateToChart);

    Template.getTemplate = (function(orig) {
      return function(id) {
        var $template, template = orig.apply(this, arguments);
        if (id === 'main') {
          $template = $(template);
          $template.find(".navbar-header")
            .append($("<a>")
              .addClass("btn btn-default navbar-btn button-right")
              .attr({"type":"button","href":"#analysis","data-target":"#analysis"})
              .append($("<span>")
                .addClass("glyphicon glyphicon-flash"))
              .append($("<span>")
                .addClass("buttonCaption")
                .text("{{_i}}main.analysisView{{/i}}")));
          template = $template.html();
        }
        return template;
      };
    })(Template.getTemplate);

    // replace I18N placeholders
    var $page = $("#analysis-page");
    $page.html(Mustache.to_html($page.html()));

  })();


  $.getJSON("settings.json", function(json) {
    StartController.init($.extend({}, json));
    $(document).ready(function(){
      $('[data-target="#analysis"]').click(function(){
        Pages.navigateToStatistics();
      });
      $('[data-toggle="#analysis-sidebar"]').click(function(){
        Pages.toggleAnalysisSidebar();
      });
    });
  });
});

