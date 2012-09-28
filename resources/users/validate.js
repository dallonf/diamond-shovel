if (this.email && !this.email.match(/^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}$/i)) {
  error('email', "is not valid email");
}

if (!this.minecraftName) {
    this.minecraftName = this.username || "";
}

if (this.minecraftName.length < 2 || this.minecraftName.match(/[^A-Za-z0-9_]/) || this.minecraftName.length > 16) {
    error('minecraftName', "Not a valid Minecraft name!");
}