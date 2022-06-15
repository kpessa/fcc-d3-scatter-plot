const { csv , select , scaleLinear , extent , axisLeft , axisBottom  } = d3;
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then((response)=>response.json()).then((data)=>{
    console.log(data);
}).catch((error)=>console.log(error));

//# sourceMappingURL=index.c36f364e.js.map
