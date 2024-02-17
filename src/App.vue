<template>
  <div>
    <header class="navbar">
      <div class="header-container">
        <router-link to="/" class="logo">PicScape</router-link>
        <nav>
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/upload" class="nav-link">Upload</router-link>
          <router-link to="/account" class="nav-link">Account</router-link>
        </nav>
      </div>
    </header>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
}



.navbar {
  background-color: #282b30;
  color: #fff;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 100px;
  transition: background-color 0.3s;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;

}

.logo:hover {
  color: #ffd700;
}

.nav-link {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  margin-left: 20px;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #007bff; 
}

.header-container {
  width: 700px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}
</style>
