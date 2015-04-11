/*
 * Copyright 2014 52°North Initiative for Geospatial Open Source Software GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(function() {

  var ShinyController = (function() {
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
        timeseries.push(ts.getApiUrl() + "timeseries/" + ts.getTsId());
      });
      return timeseries;
    };

    ShinyController.prototype.getColors = function() {
      var colors = [];
      var ts = TimeSeriesController.getTimeseriesCollection();
      $.each(ts, function(id, ts) {
        colors.push(ts.getStyle().getColor());
      });
      return colors;
    };

    ShinyController.prototype._bind = function() {
      EventManager.subscribe("time:end:change", $.proxy(this, "_onTimeEndChange"));
      EventManager.subscribe("time:start:change", $.proxy(this, "_onTimeStartChange"));
      EventManager.subscribe("timeextent:change", $.proxy(this, "_onTimeExtentChange"));
      EventManager.subscribe("timeseries:add", $.proxy(this, "_onTimeSeriesAdd"));
      EventManager.subscribe("timeseries:remove", $.proxy(this, "_onTimeSeriesRemove"));
      EventManager.subscribe("timeseries:removeAll", $.proxy(this, "_onTimeSeriesRemoveAll"));
      EventManager.subscribe("timeseries:changeStyle", $.proxy(this, "_onTimeSeriesStyleChange"));
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

    ShinyController.prototype._onTimeSeriesStyleChange = function() {
      this.trigger("change:timeseries:style");
    };

    ShinyController.prototype._onTimeExtentChange = function(e, extent) {
      this._onTimeStartChange(e, extent.from);
      this._onTimeEndChange(e, extent.till);
    };

    ShinyController.prototype._onTimeSeriesAdd = function() {
      this.trigger("change:timeseries");
      this.trigger("change:timeseries:style");
    };

    ShinyController.prototype._onTimeSeriesRemove = function() {
      this.trigger("change:timeseries");
      this.trigger("change:timeseries:style");
    };

    ShinyController.prototype._onTimeSeriesRemoveAll = function() {
      this.trigger("change:timeseries");
      this.trigger("change:timeseries:style");
    };

    return ShinyController;
  })();

  var ReadOnlyInputBinding = (function() {
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

    return ReadOnlyInputBinding;
  })();

  var SWCInputBinding = (function() {
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
      var i, events = $.isArray(this.event) ? this.event : [this.event];
      for (i = 0; i < events.length; ++i) {
        this.ctrl.on(events[i], function() {
          /* the values are beeing set _AFTER_ the event is published,
           * so defer the callback to later */
          setTimeout(function() { callback(true); }, 0);
        });
      }
    };

    SWCInputBinding.prototype.unsubscribe = function(el) {
      var i, events = $.isArray(this.event) ? this.event : [this.event];
      for (i = 0; i < events.length; ++i) {
        this.ctrl.off(events[i]);
      }
    };

    return SWCInputBinding;
  })();

  var TimeInputBinding = (function() {
    function TimeInputBinding(ctrl, selector, event) {
      SWCInputBinding.call(this, ctrl, selector, event);
    }

    TimeInputBinding.prototype = Object.create(SWCInputBinding.prototype);

    TimeInputBinding.prototype.getType = function() {
      return "n52.datetime";
    };

    TimeInputBinding.prototype.getValue = function(el) {
      var time = this._getValueAsMoment();
      return time && time.isValid() ? time.toDate() : null;
    };

    TimeInputBinding.prototype._getValueAsMoment = function() {
      throw new Error("Abstract");
    };
    return TimeInputBinding;
  })();

  var TimeStartInputBinding = (function(){
    function TimeStartInputBinding(ctrl) {
      TimeInputBinding.call(this, ctrl, "input.jsc-time-start", "change:time:start");
    }

    TimeStartInputBinding.prototype = Object.create(TimeInputBinding.prototype);

    TimeStartInputBinding.prototype._getValueAsMoment = function() {
      return this.ctrl.getTimeStart();
    };

    return TimeStartInputBinding;
  })();

  var TimeEndInputBinding = (function(){
    function TimeEndInputBinding(ctrl) {
      TimeInputBinding.call(this, ctrl, "input.jsc-time-end", "change:time:end");
    }

    TimeEndInputBinding.prototype = Object.create(TimeInputBinding.prototype);

    TimeEndInputBinding.prototype._getValueAsMoment = function() {
      return this.ctrl.getTimeEnd();
    };

    return TimeEndInputBinding;
  })();

  var TimeseriesInputBinding = (function() {
    function TimeseriesInputBinding(ctrl) {
        SWCInputBinding.call(this, ctrl, "input.jsc-timeseries", "change:timeseries");
    }

    TimeseriesInputBinding.prototype = Object.create(SWCInputBinding.prototype);

    TimeseriesInputBinding.prototype.getValue = function(el) {
      return this.ctrl.getTimeseries();
    };

    TimeseriesInputBinding.prototype.getType = function() {
      return "n52.timeseries";
    };

    return TimeseriesInputBinding;
  })();

  var TimeseriesColorInputBinding = (function() {
    function TimeseriesColorInputBinding(ctrl) {
        SWCInputBinding.call(this, ctrl, "input.jsc-timeseries-colors", "change:timeseries:style");
    }

    TimeseriesColorInputBinding.prototype = Object.create(SWCInputBinding.prototype);

    TimeseriesColorInputBinding.prototype.getValue = function(el) {
      return this.ctrl.getColors();
    };

    TimeseriesColorInputBinding.prototype.getType = function() {
      return 'n52.timeseries.colors';
    };

    return TimeseriesColorInputBinding;
  })();


  var TimeIntervalInputBinding = (function() {
    function TimeIntervalInputBinding(ctrl) {
        SWCInputBinding.call(this, ctrl, "input.jsc-time-interval",
          ["change:time:start", "change:time:end"]);
    }

    TimeIntervalInputBinding.prototype = Object.create(SWCInputBinding.prototype);

    TimeIntervalInputBinding.prototype.getType = function() {
      return "n52.timeinterval"
    };

    TimeIntervalInputBinding.prototype.getValue = function(el) {
      var end   = this.ctrl.getTimeEnd(),
          start = this.ctrl.getTimeStart();
      return [
        start && start.isValid() ? start.toDate() : null,
          end &&   end.isValid() ?   end.toDate() : null
      ];
    };

    return TimeIntervalInputBinding;
  })();

  var ctrl = new ShinyController();
  Shiny.inputBindings.register(new TimeStartInputBinding(ctrl),       "n52.swc.time-start");
  Shiny.inputBindings.register(new TimeEndInputBinding(ctrl),         "n52.swc.time-end");
  Shiny.inputBindings.register(new TimeseriesInputBinding(ctrl),      "n52.swc.time-series");
  Shiny.inputBindings.register(new TimeIntervalInputBinding(ctrl),    "n52.swc.time-interval");
  Shiny.inputBindings.register(new TimeseriesColorInputBinding(ctrl), "n52.swc.time-series-colors");

  (function() {
    Pages.navigateToStatistics = function() {
      ChartController.visible = false;
      Pages.navigateToPage("#analysis-page");
      location.href = "#analysis";
      Pages.togglePhenomenon(false);
      Pages.toggleLegend(false);
    };

    Pages.toggleAnalysisSidebar = function(active) {
      var $pane = $("#analysis-sidebar"),
          $btn = $('[data-toggle="#analysis-sidebar"]');
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

  $.getJSON("settings.json").always(function(json, status) {
    if (status !== "success") json = {};
    StartController.init(json);
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
