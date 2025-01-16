<template>  
  <div>  
    <button @click="handleAuthorize">Connect Bot Twitter Account</button>  
    <!-- {{ authStatus }}   -->
  </div>  
</template>  
  
<script>  
import { twitterAuth } from '@gptx/base/api/meme-bot';
export default {  
  data() {  
    return {  
      authStatus: "unauthorized",
      currentToken: '',
    };  
  },  
  async created() {  
  }, 
  methods: {  
    async twitterAuth() {
      let url = ""
      const response = await twitterAuth()
      if (response.code === 200) {
        url = response.data.redirect_uri
      } else {
        console.error('Failed to obtain twitter auth url')
      }
      
      return url;
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
