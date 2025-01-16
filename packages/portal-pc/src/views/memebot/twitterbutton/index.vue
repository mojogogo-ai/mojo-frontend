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
      authStatus: "lala",
    };  
  },  
  async created() {  
  }, 
  methods: {  
    async twitterAuth() {
      let url = ""
      const response = await twitterAuth()
      if (response.code === 200) {
        url = response.data.redirect_uri;
        this.authStatus = response.data.state;
      } else {
        console.error('Failed to obtain twitter auth url')
      }
      
      return url;
    },
    async handleAuthorize() {  
      const twitterAuthUrl = await this.twitterAuth();
      this.$emit('update-auth-status', this.authStatus);
      const popup = window.open(twitterAuthUrl, "twitterAuthPopup", "width=500,height=600");  
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
