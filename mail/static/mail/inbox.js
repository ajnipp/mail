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
  document.querySelector('#email-view').style.display = 'none';
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
  };
}

function reply(email) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: \n${email.body}`;

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
  };
}

function load_email(email_id) {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  fetch(`emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      document.getElementById('view-sender').innerHTML = email.sender;
      document.getElementById('view-recipients').innerHTML = email.recipients;
      document.getElementById('view-subject').innerHTML = email.subject;
      document.getElementById('view-timestamp').innerHTML = email.timestamp;
      document.getElementById('view-body').innerHTML = email.body;
      
      document.getElementById('reply').onclick = function () {
        reply(email)
      }

      const archive = document.getElementById('archive');
      if (email.archived) {
        archive.innerHTML = 'Unarchive';
        archive.onclick = function () {

          fetch(`emails/${email_id}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: false
            })
          })
            .catch(error => {
              console.log(error);
            });
          load_email(email_id);
        }
      } else {
        archive.innerHTML = 'Archive';
        archive.onclick = function () {

          fetch(`emails/${email_id}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: true
            })
          })
            .catch(error => {
              console.log(error);
            });
          load_email(email_id);
        }
      }

      fetch(`emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      })
        .catch(error => {
          console.log(error);
        });

    })
    .catch(error => {
      console.log(error);
    });
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  document.querySelector('#emails-list').innerHTML = '';

  // Show the mailbox name
  document.querySelector('#emails-view-title').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);
      emails.forEach(email => {
        const box = document.createElement('div');
        box.className = 'email-preview';
        if (email.read === true) {
          box.style.backgroundColor = '#D3D3D3';
        } else {
          box.style.backgroundColor = 'white';
        }
        box.onclick = function () {
          load_email(email.id)
        }
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