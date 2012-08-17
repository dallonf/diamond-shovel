if (this.email && !this.email.match(/^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}$/i)) {
  error('email', "is not valid email");
}

if (!this.minecraftName) {
    this.minecraftName = this.username;
}