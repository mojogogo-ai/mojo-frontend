<template>  
  <div>  
    <button @click="handleAuthorize">Authorize Twitter</button>  
    <!-- {{ authStatus }}   -->
  </div>  
</template>  
  
<script>  
export default {  
  data() {  
    return {  
      authStatus: "unauthorized",
      currentToken: '',
    };  
  },  
  async created() {  
    this.currentToken = await this.fetchToken();
  }, 
  methods: {  
    async fetchToken(){
      const response = await fetch('http://localhost:9004/portal/v1/open/auth/grant-token', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          appid: 'I6iz8SAHfimCuGQMCbwN',  
          appkey: 'PcpTHb2q6w39oxQqCP1s',  
          uid: 'sdfasfas',  
        }),  
      });  
      
      if (!response.ok) {  
        throw new Error('Failed to obtain token');  
      }  
      
      const data = await response.json();  
      return data.data.token;  
    },
    async twitterAuth() {
      const response = await fetch(`http://localhost:9004/portal/v1/twitter/authorize?token=${this.currentToken}`, {  
        method: 'GET',  
        headers: {  
          'Content-Type': 'application/json',  
        }
      });
      
      if (!response.ok) {  
        throw new Error('Failed to obtain token');  
      }  
      
      const data = await response.json(); 
      return data.data.redirect_uri;
    },
    async handleAuthorize() {  
      const twitterAuthUrl = await this.twitterAuth();
      const popup = window.open(twitterAuthUrl, "twitterAuthPopup", "width=500,height=600");  
  
      window.addEventListener("message", this.handleMessageEvent, false);  
    },  
    handleMessageEvent(event) {  
      // Validate event origin to ensure it is from a trusted source  
      if (event.origin !== "http://localhost:9004") {  
        console.error("Untrusted message source:", event.origin);  
        return;  
      }  
  
      // Process the message received from the callback page  
      const { code, message } = event.data;  
      
      if (code === 200) {  
        this.authStatus = "Authorization Successful! 🎉";  
      } else {  
        this.authStatus = `Authorization Failed: ${message}`;  
      }  
  
      // Remove the message event listener to avoid duplicate handling  
      window.removeEventListener("message", this.handleMessageEvent);  
    },  
  },  
};  
</script>  
  
<style scoped>  
button {  
  font-size: 14px;  
  padding: 10px 20px;  
  color: #ffffff;  
  background-color: #1da1f2;  
  border: none;  
  border-radius: 5px;  
  cursor: pointer;  
}  
button:hover {  
  background-color: #1a91da;  
}  
</style>
