export const updateStateVoteDb = async(event: any) => { 

    if(event.token) {
      console.log(event.token); 
    }   
    return {
		  updateDb: 'ok'
	  }

};