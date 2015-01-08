![Noat](https://raw.github.com/willyg302/Noat/master/noat-logo.png "Wally Says Hi!")

-----

A dead-simple app for CRUD-ing tiny bits of information. Some features:

- Powered by [Google App Engine](https://developers.google.com/appengine/) and [AngularJS](https://angularjs.org/)
- Write notes in GitHub-flavored Markdown using the [Ace editor](http://ace.c9.io/#nav=about)
- Very simple interface (create, update, star, or delete...that's it!)
- Mobile-friendly

## Setup

Noat is designed to be run as your own App Engine application. This section will walk you through deploying Noat for the first time.

1. Download the Google App Engine SDK for Python from the [downloads](https://developers.google.com/appengine/downloads) page
2. Register a new App Engine application
3. Install [ok](https://github.com/willyg302/ok)
4. Deploy Noat!

```bash
ok init gh:willyg302/Noat
cd Noat
ok run build gae_deploy
```

During the `build` step, you will be prompted for an **App name** and **App key**. **App name** is the name of your newly registered application. **App key** is a password that you will later use to access your notes.

> **Note**: The `gae_deploy` step assumes that you have installed the SDK to `~/appengine/` on Linux. You can, of course, deploy the generated `dist/` directory like a standard App Engine app (for example, through the Launcher on a Mac).

## Using Noat

When you visit Noat for the first time, you will be greeted with a minimalist login page. Enter your **App key** here.

> **Note**: If you have cookies enabled in your browser, you do not need to log in every time. Noat stores an automatic login cookie that expires in 30 days.

Most of Noat's workflows are fairly straightforward. Here are a few things that might not be immediately obvious:

- In the search box, enter `#favorite` or `#star` to filter only starred notes
- In the search box, enter `#deleted` or `#trash` to filter only deleted notes (by default not shown)
- You can create an application icon on iOS devices for one-tap access

## Why Noat?

I needed a way of having small bits of information available to me at all times, from any device I owned, without all the fuss of a big desktop application, login forms, and the like. I needed something in between Pastebin (with a bit more security and better markup features) and Wunderlist (without all the complexity).

Before making Noat, I used to rely on email to fill the void. Sometimes I would be at school and find a neat link that I'd want to revisit later at home. How could I communicate the link to myself? By syncing bookmarks? By adding it to a file in my Dropbox? No...by emailing myself the link. It seems old-fashioned, but it was really the easiest way to go.

Now, I just click on my Noat bookmark, create a new note, paste the link, and save. Even easier!

## Why "Noat"?

There seems to be a recent software development trend of abusing the English language in every way possible when coming up with app names. Noat continues this tradition in style. Plus note rhymes with goat. I mean, isn't that kind of obvious?

## Roadmap (v1.2.0)

- [ ] Encrypt notes...? (using app key)
- [ ] Tests
