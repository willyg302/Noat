![Noat](https://raw.github.com/willyg302/Noat/master/noat-logo-922.png "Wally Says Hi!")

---

A dead-simple app for CRUD-ing tiny bits of information. Some features:

* Powered by App Engine, themed by Bootstrap
* Uses [Summernote](http://hackerwins.github.io/summernote/) for sweet WYSIWYG editing
* Very simple interface (add a note, edit it, or delete it...that's it!)
* Mobile-friendly

Setup
-----

Open up **app.yaml** and change `[YOUR APPLICATION HERE]` to the name of your own App Engine application.

After deploying to App Engine, you will need to set up an "author" that will be the ancestor of all notes written in Noat. To do this, navigate to `yourapp.appspot.com/admin/`, login using your Google credentials, and visit the Interactive Console. Run the following code:

```
from google.appengine.ext import ndb
from noat import Author

newauthor = Author(author_name='[AUTHOR NAME HERE]', author_pass='[HASHED PASS HERE]')
newauthor.put()
```

A good way to get a password is by hashing it using SHA-256:

```
import hashlib

print hashlib.sha256([AUTHOR PASS HERE] + [SECRET SALT]).hexdigest()
```

You can then use the output of the above code for the value of `[HASHED PASS HERE]`.

Using Noat
----------

Visit yourapp.appspot.com/rnote?p=[HASHED PASS HERE]&n=[AUTHOR NAME HERE].

There is no login form; Noat just uses the username and password provided via the URL to retrieve notes. Since this isn't secure from eavesdropping, Noat is not recommended for storing sensitive information.

That being said, this makes Noat very easy to use. Just bookmark the above URL in all your browsers and you've got all your notes synced everywhere. Noat also includes Apple icon support, so you can create an application icon on iOS devices for one-tap access.

Why Noat?
---------

I needed a way of having small bits of information available to me at all times, from any device I owned, without all the fuss of a big desktop application, login forms, and the like. I needed something in between Pastebin (with a bit more security and better markup features) and Wunderlist (without all the complexity).

Before making Noat, I used to rely on email to fill the void. Sometimes I would be at school and find a neat link that I'd want to revisit later at home. How could I communicate the link to myself? By syncing bookmarks? By adding it to a file in my Dropbox? No...by emailing myself the link. It seems old-fashioned, but it was really the easiest way to go.

Now, I just click on my Noat bookmark, add a new note, paste the link, and save. Even easier!

Why "Noat"?
-----------

There seems to be a recent software development trend of abusing the English language in every way possible when coming up with app names. Noat continues this tradition in style. Plus note rhymes with goat. I mean, isn't that kind of obvious?