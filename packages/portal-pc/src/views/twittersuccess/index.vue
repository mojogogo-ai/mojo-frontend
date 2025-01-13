<template>  
  <div>  
    <h1>Processing Authorization...</h1>  
    <p>Please wait, we are processing your authorization request.</p>  
  </div>  
</template>  
<script>  
export default {  
  mounted() {  
    try {  
      const rawResponse = document.body.innerText;  
      const response = JSON.parse(rawResponse);  
      this.notifyParent(response);  
      setTimeout(() => {  
        window.close();  
      }, 1000);  
    } catch (error) {  
      console.error("Error parsing Twitter response:", error);  
      this.notifyParent({  
        code: 500,  
        message: "Error parsing response from Twitter.",  
      });  
      setTimeout(() => {  
        window.close();  
      }, 1000);  
    }  
  },  
  methods: {  
    notifyParent(response) {  
      window.opener.postMessage(response, "http://localhost:9004/#/twitter/success");  
    },  
  },  
};  
</script>  


<style scoped>  
h1 {  
  color: #1da1f2;  
}  
</style>