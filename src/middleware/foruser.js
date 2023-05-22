const filterrequest = (req,res,next)=>{
    let rawData = '';

    req.on('data', (chunk) => {
      rawData += chunk;
    });
  
    req.on('end', () => {
        // console.log(rawData);
        try{
            let t = JSON.parse(rawData);
            // console.log("this is t",t);
            req.body = t; 
        }
        catch(err){
            // console.log("this is err",err);
            req.body = undefined;
        }finally{
            next();
        }
    });
}


export {filterrequest};