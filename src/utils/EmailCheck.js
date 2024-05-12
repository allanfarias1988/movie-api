class EmailCheck {
  constructor(email) {
    this.email = email;
  }

  isValid() {
    const isValidEmail = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return isValidEmail.test(this.email);
  }
}

export default EmailCheck;
