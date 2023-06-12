document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Change the function of the form
  document.querySelector('#compose-form').onsubmit = function () {

    console.log('Form submitted!')
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error)
      });
    return false;
  };
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  document.querySelector('#emails-list').innerHTML = '';
  
  // Show the mailbox name
  document.querySelector('#emails-view-title').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);
      emails.forEach( email => {
        const box = document.createElement('div');
        box.className = 'email-preview';
        const sender = document.createElement('div');
        sender.className = 'email-preview-sender';
        sender.innerHTML = email.sender; 
        const subject = document.createElement('div');
        subject.className = 'email-preview-subject';
        subject.innerHTML = email.subject; 
        const timestamp = document.createElement('div');
        timestamp.className = 'email-preview-timestamp';
        timestamp.innerHTML = email.timestamp; 
        box.append(sender);
        box.append(subject);
        box.append(timestamp);

        const emails_container = document.querySelector('#emails-list');
        emails_container.append(box);
      })
    });
}