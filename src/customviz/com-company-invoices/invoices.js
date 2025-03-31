define(['jquery',
        'obitech-framework/jsx',
        'obitech-report/datavisualization',
        'obitech-reportservices/datamodelshapes',
        'obitech-reportservices/events',
        'obitech-appservices/logger',
        'ojL10n!com-company-invoices/nls/messages',
        'obitech-framework/messageformat',
        'skin!css!com-company-invoices/invoicesstyles'],
        function($,
                 jsx,
                 dataviz,
                 datamodelshapes,
                 events,
                 logger,
                 messages) {
   "use strict";

   var MODULE_NAME = 'com-company-invoices/invoices';

   //Param validation to detect cyclical dependencies (ignore modules not used in resource arguments)
   jsx.assertAllNotNullExceptLastN(arguments, "invoices.js arguments", 2);

   var _logger = new logger.Logger(MODULE_NAME);

   // The version of our Plugin
   Invoices.VERSION = "1.0.0";

   /**
    * The implementation of the invoices visualization.
    * 
    * @constructor
    * @param {string} sID
    * @param {string} sDisplayName
    * @param {string} sOrigin
    * @param {string} sVersion
    * @extends {module:obitech-report/visualization.Visualization}
    * @memberof module:com-company-invoices/invoices#
    */
   function Invoices(sID, sDisplayName, sOrigin, sVersion) {
      // Argument validation done by base class
      Invoices.baseConstructor.call(this, sID, sDisplayName, sOrigin, sVersion);
   };
   jsx.extend(Invoices, dataviz.DataVisualization);

   Invoices.prototype._render = function(oTransientRenderingContext){
      try {
         // Note: all events will be received after initialize and start complete.  We may get other events
         // such as 'resize' before the render, i.e. this might not be the first event.

         // Retrieve the data object for this visualization
         var oDataLayout = oTransientRenderingContext.get(dataviz.DataContextProperty.DATA_LAYOUT);
         // Determine the number of records available for rendering on ROW
         // Because we specified that Category should be placed on ROW in the data model handler,
         // this returns the number of rows for the data in Category.
         var nRows = oDataLayout.getEdgeExtent(datamodelshapes.Physical.ROW);
         var nCols = oDataLayout.getEdgeExtent(datamodelshapes.Physical.COLUMN);

         //var rowValue1 = oDataLayout.getValue(datamodelshapes.Physical.ROW, 1 , 0, false);
         var oDataModel = this.getRootDataModel();
         var allMeasures = oDataModel.getColumnIDsIn(datamodelshapes.Physical.DATA);
            const table = document.createElement("table");
            table.setAttribute("id", "table_id");
            document.body.appendChild(table);
            const row = document.createElement("tr");
            row.style.paddingBottom = "1rem"
            document.getElementById("table_id").appendChild(row);
            const th = document.createElement("th");
            document.getElementById("table_id").appendChild(th);
            // HEADER LABEL 
            var rowLayer1 = oDataLayout.getLayerMetadata(datamodelshapes.Physical.ROW, 0 , 1);
            var title = document.createTextNode(rowLayer1)
            th.appendChild(title)

            /*const th2 = document.createElement("th");
            var rowLayer2 = oDataLayout.getLayerMetadata(datamodelshapes.Physical.ROW, 1 , 1);
            //var cText = th2.createTextNode(rowLayer2)
            const text2 = document.createTextNode(rowLayer2)
            th2.appendChild(text2);
            document.getElementById("table_id").appendChild(th2);
            */
            const th3 = document.createElement("th");
            const measureLabel1 = allMeasures[0];
            //var cText = th2.createTextNode(rowLayer2)
            const text3 = document.createTextNode(measureLabel1)
            th3.appendChild(text3);
            document.getElementById("table_id").appendChild(th3);

            const th4 = document.createElement("th");
            //var cText = th2.createTextNode(rowLayer2)
            const measureLabel2 = allMeasures[1];
            const text4 = document.createTextNode(measureLabel2)
            th4.appendChild(text4);
            document.getElementById("table_id").appendChild(th4);

            const th5 = document.createElement("th");
            //var cText = th2.createTextNode(rowLayer2)
            const measureLabel3 = allMeasures[2];
            const text5 = document.createTextNode(measureLabel3)
            th5.appendChild(text5);
            document.getElementById("table_id").appendChild(th5);
            

            var rowValue1;
            var rowValue2;
            var rowValue3;
            var rowValue4;

            var measureValue1;
            var measureValue2;
            var measureValue3;
            var elContainer = this.getContainerElem();

         for(var i = 0 ; i < nRows / 3 ; i++ ) { 
            //attr .ROW
            rowValue1 = oDataLayout.getValue(datamodelshapes.Physical.ROW, 0 , i * 3, false);
            //rowValue2 = oDataLayout.getValue(datamodelshapes.Physical.ROW, 1 , i * 3, false);
            //rowValue3 = oDataLayout.getValue(datamodelshapes.Physical.ROW, 2 , i, false);
            //rowValue4 = oDataLayout.getValue(datamodelshapes.Physical.ROW, 3 , i, false);
            //measure .DATA
            //----measure from data 
            measureValue1 = oDataLayout.getValue(datamodelshapes.Physical.DATA, i+1, 0, true)
            measureValue2 = oDataLayout.getValue(datamodelshapes.Physical.DATA, i+2, 0, true)
            measureValue3 = oDataLayout.getValue(datamodelshapes.Physical.DATA, i+3, 0, true)

            //measureValue1 = oDataLayout.getValue(datamodelshapes.Physical.DATA, i *3, 0, true);
            //measureValue2 = oDataLayout.getValue(datamodelshapes.Physical.DATA, (i*3) + 1 , 0, true);
            //measureValue3 = oDataLayout.getValue(datamodelshapes.Physical.DATA, (i*3) + 2 , 0, true);
            //var nRows = oDataLayout.getEdgeExtent(datamodelshapes.Physical.ROW);
            console.log(measureValue2)
            console.log(measureValue1)
            //meassureValue3 = oDataLayout.getValue(datamodelshapes.Physical.DATA, i , 2, false);
            //$(elContainer).append("RowN: "+ i +" " + rowValue+ "<br>"); 
            //$(elContainer).append("valueN: "+ i +" " + value+ "<br>"); 
            const row2 = document.createElement("tr");
            row2.setAttribute("id" , "rows")
            document.getElementById("table_id").appendChild(row2);
            const td1 = document.createElement("td");
            var div = document.createElement("div");
            if(i == 0){
               div.setAttribute("id", "green_circle");
            }
            if(i == 1){
               div.setAttribute("id", "yellow_circle");
            }
            if(i == 2){
               div.setAttribute("id", "red_circle");
            }
            if(i == 3){
               div.setAttribute("id", "circle");
            }
         
            document.getElementById("table_id").appendChild(td1);
            const text1 = document.createTextNode(rowValue1);
            td1.appendChild(div);
            div.appendChild(text1)
         /*   const td2 = document.createElement("td");
            document.getElementById("table_id").appendChild(td2);
            const text2 = document.createTextNode(rowValue2);
            td2.appendChild(text2)
         */
            const td3 = document.createElement("td");
            document.getElementById("table_id").appendChild(td3);
            const text3 = document.createTextNode(measureValue1);
            td3.appendChild(text3)
            const td4 = document.createElement("td");
            document.getElementById("table_id").appendChild(td4);
            const text4 = document.createTextNode(measureValue2);
            td4.appendChild(text4)
            const td5 = document.createElement("td");
            document.getElementById("table_id").appendChild(td5);
            const text5 = document.createTextNode(measureValue3);
            td5.appendChild(text5)
         }
         $(elContainer).html(table);

         // Retrieve the root container for our visualization.  This is provided by the framework.  It may not be deleted
         // but may be used to render.

      }
      finally {
         this._setIsRendered(true);
      }
   }
   
   /**
    * Called whenever new data is ready and this visualization needs to update.
    * @param {module:obitech-renderingcontext/renderingcontext.RenderingContext} oTransientRenderingContext
    */
   Invoices.prototype.render = function(oTransientRenderingContext) {
     this._render(oTransientRenderingContext);
    };


        /**
         * Resize the visualization
         * @param {Object} oVizDimensions - contains two properties, width and height
         * @param {module:obitech-report/vizcontext#VizContext} oTransientVizContext the viz context
         */
        Invoices.prototype.resizeVisualization = function(oVizDimensions, oTransientVizContext){
         var oTransientRenderingContext = this.createRenderingContext(oTransientVizContext);
         this._render(oTransientRenderingContext);
     };
   
     /**
      * Re-render the visualization when settings changes
      */
     Invoices.prototype._onDefaultSettingsChanged = function(){
         var oTransientVizContext = this.assertOrCreateVizContext();
         var oTransientRenderingContext = this.createRenderingContext(oTransientVizContext);
         this.render(oTransientRenderingContext);
         this._setIsRendered(true);
     }

   /**
    * Factory method declared in the plugin configuration
    * @param {string} sID Component ID for the visualization
    * @param {string=} sDisplayName Component display name
    * @param {string=} sOrigin Component host identifier
    * @param {string=} sVersion 
    * @returns {module:com-company-invoices/invoices.Invoices}
    * @memberof module:com-company-invoices/invoices
    */
   function createClientComponent(sID, sDisplayName, sOrigin) {
     // Argument validation done by base class
      return new Invoices(sID, sDisplayName, sOrigin, Invoices.VERSION);
   };

   return {
      createClientComponent : createClientComponent
   };
});