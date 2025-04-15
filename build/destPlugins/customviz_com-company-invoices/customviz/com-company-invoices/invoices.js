define(['jquery',
        'obitech-framework/jsx',
        'obitech-report/datavisualization',
        'obitech-reportservices/datamodelshapes',
        'obitech-reportservices/data', 
        'd3js',
        'obitech-reportservices/events',
        'obitech-appservices/logger',
        'ojL10n!com-company-invoices/nls/messages',
        'obitech-framework/messageformat',
        'skin!css!com-company-invoices/invoicesstyles'],
        function($,
                 jsx,
                 dataviz,
                 datamodelshapes,
                 data,
                 d3,
                 events,
                 logger,
                 messages) {
   "use strict";

   var MODULE_NAME = 'com-company-invoices/invoices';

   //Param validation to detect cyclical dependencies (ignore modules not used in resource arguments)
   jsx.assertAllNotNullExceptLastN(arguments, "invoices.js arguments", 2);

   var _logger = new logger.Logger(MODULE_NAME);

   // The version of our Plugin
   Invoices.VERSION = "1.1.0";

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


   
   /**
    * Called whenever new data is ready and this visualization needs to update.
    * @param {module:obitech-renderingcontext/renderingcontext.RenderingContext} oTransientRenderingContext
    */
   Invoices.prototype.render = function(oTransientRenderingContext) {
     this._render(oTransientRenderingContext);
    };

    Invoices.prototype._render = function(oTransientRenderingContext){
      try {
         // Note: all events will be received after initialize and start complete.  We may get other events
         // such as 'resize' before the render, i.e. this might not be the first event.

         // Retrieve the data object for this visualization
         var oDataLayout = oTransientRenderingContext.get(dataviz.DataContextProperty.DATA_LAYOUT);

         // Retrieve the root container for our visualization.  This is provided by the framework.  It may not be deleted
         // but may be used to render.
         var elContainer = this.getContainerElem();

         $(elContainer).empty(); // Clear the container before rendering

         $(elContainer).addClass("testDVTableRootContainer"); // Add a class to the container for styling
         var sVizContainerId = this.getSubElementIdFromParent(this.getContainerElem(), "tdvtc"); // Get the ID of the container for the visualization
         $(elContainer).html("<div id=\"" + sVizContainerId + "\" class=\"testDVTableContainer\"></div>"); // Create a new div for the visualization")
         var elVizContainer = document.getElementById(sVizContainerId); // Get the container for the visualization

         var nWidth = $(elContainer).width();   // Get the width of the container
         var nHeight = $(elContainer).height(); // Get the height of the container
         var nMargin = 10; // Margin for the SVG element

         // Format for the table header
         var fFormatHeader = function(s) {
            return s
               .replace(/_/g, ' ') // Replace underscores with spaces
               .split(" ") // Split the string into words
               .map(word => {
                  // If word is already capitalized or all caps, return it as is
                  if (word === word.toUpperCase() || word[0] === word[0].toUpperCase()) {
                     return word;
                  }
                  // Otherwise, capitalize the first letter and return the word
                  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
               })
               .join(" "); // Join the words back together with spaces
         }
         
         // Create the table element
         var oTable = d3.select(elVizContainer).append("table")
            .style("width", (nWidth - nMargin) + "px") // Set the width of the table
            .attr("id", "renderedTable"); // Set the ID of the table

         
         var {aDataHeaders, oData} = this._generateData(oDataLayout); // Generate the data for the visualization
         if (!oData) {
            return; // Return if no data is available
         }
         console.log(aDataHeaders);
         console.log(oData)

         // Function to render the table
         var fRenderData = function(aDataHeaders, oData) {

            // Create the header row
            var oTableHeader = oTable.append("thead").append("tr")
               .selectAll("th")
               .data(aDataHeaders)
               .enter()
               .append("th")
               .text(d => fFormatHeader(d)); // Set the header text

            var oTableBody = oTable.append("tbody"); // Create the body of the table

            // Add rows to the table body
            oData.forEach(d => {
               var oTableBodyRow = oTableBody.append("tr"); // Create a new row for each data object
               // Add cells to the row
               aDataHeaders.forEach(h => {
                  var oCell = oTableBodyRow.append("td")
                     .text(d[h]); // Set the cell text to the corresponding data value
                  const val1 = oData[0].days_past_due_bucket_code
                  const val2 = oData[1].days_past_due_bucket_code
                  const val3 = oData[2].days_past_due_bucket_code
                  const val4 = oData[3].days_past_due_bucket_code

                  console.log(val1)
                  console.log(val2)
                  console.log(val3)

                  if(d[h] == val1){
                     oCell.attr("id" , "green_circle")
                  }
                  if(d[h] == val2){
                     oCell.attr("id" , "yellow_circle")
                  }
                  if(d[h] == val3){
                     oCell.attr("id" , "red_circle")
                  }
                  if(d[h] == val4){
                     oCell.attr("id" , "circle")
                  }

               });
            })
         }


         fRenderData(aDataHeaders, oData); // Call the function to render the table
      }
      finally {
         this._setIsRendered(true);
      }

   }


   /**
    * Generates data in the form or parent-child nodes, each node has a name and a children property.
    * @param {module:obitech-renderingcontext/renderingcontext.RenderingContext} oTransientRenderingContext - The rendering context
    * @returns {Object}
    */
   Invoices.prototype._generateData = function(oDataLayout){
      var oDataModel = this.getRootDataModel(); // Get the root data model

      if (!oDataModel || !oDataLayout) {
         return; // Return empty data if no data model or layout is available
      }

      var nRowCount = oDataLayout.getEdgeExtent(datamodelshapes.Physical.ROW);   // Get the number of rows
      // console.log("nRowCount: " + nRowCount);

      var nRowLayerCount = oDataLayout.getLayerCount(datamodelshapes.Physical.ROW); // Get the number of row layers
      // console.log("nRowLayerCount: " + nRowLayerCount);

      var aAttributeIds = oDataModel.getColumnIDsIn(datamodelshapes.Physical.ROW); // Get the attribute IDs in the row
      // console.log("aAttributeIds: " + aAttributeIds);
      var nAttributeCount = aAttributeIds.length; // Get the number of attributes

      var aMeasureIds = oDataModel.getColumnIDsIn(datamodelshapes.Physical.DATA); // Get the measure IDs in the data
      // console.log("aMeasureIds: " + aMeasureIds);
      var nMeasureCount = aMeasureIds.length; // Get the number of measures

      var oData = []; // Initialize the data array

      // Loop: Iterate through to create the data object
      for (var i = 0; i < nRowCount; i ++) {
         var oTempAttr = {}; // Temporary object to store each attribute group
         var sMeasureName = "";

         // Loop: Extract Attribute Values and Measure Name
         for (var j = 0; j < nRowLayerCount; j ++) {
            const sValues = oDataLayout.getValue(datamodelshapes.Physical.ROW, j, i); // Get the values in the row; j is the layer index; i is the row index

            if (j < nAttributeCount) {
               oTempAttr[aAttributeIds[j]] = sValues; // Assign the attribute values to the data row object
            }
            else if (aMeasureIds.includes(sValues)) {
               var sMeasureName = sValues; // Get the measure name
            }
         }

         // Get the measure value
         const sMeasureValue = oDataLayout.getValue(datamodelshapes.Physical.DATA, i, 0);

         // Create a unique key from attribute values to avoid duplicates and check if the group already exists in oData
         const sGroupKey = JSON.stringify(oTempAttr); 
         var existingGroup = oData.find(d => d.id === sGroupKey); 

         // If the group does not exist, create a new one
         if (!existingGroup) {
            existingGroup = { id: sGroupKey, ...oTempAttr};
            oData.push(existingGroup); // Push the new group to the data array
         }

         // existingGroup = {...oTempAttr};
         existingGroup[sMeasureName] = sMeasureValue; // Assign the measure values to the data row object
      }

      const aDataHeaders = [...aAttributeIds, ...aMeasureIds]; // Combine attribute and measure IDs to create headers

      // console.log(aDataHeaders);
      // console.log(oData);

      return {aDataHeaders, oData}; // Return the Headers and data

   }




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
         this._render(oTransientRenderingContext);
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