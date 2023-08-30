# Blogsuite
This article describes how to setup a very simple new blog inside your Angular application.

It is not fully automated, so you will need Angular knowledge to get along.
This article assumes that you create one folder with the name 'blog' in your application,
to store all files you need. Of course you can adjust as you want, but this will be the starting point.

First you can copy the file blogsuite.js into your root folder of the Angular app,
along with the filestore.bin file.
The blogsuite.js file is used to create a new articel and update the list in the list.json,
that will be read by the application to show the list of articles available.

## Blog and articles folder
There are two folders you need. One is the blog folder with the Angular components,the second is the
one to store the article files in src/assets/articles.
The articles will be Markdown files with .md fileending.

The markdown files files are stored inside the path src/assets/articles.
This folder is created automatically by blogsuite if you create the first article.
The path for the articles folder is defined in the blogsuite in the
constant 'articlesPath'.

You can create the 'blog' folder where you like, paths are relative and some adjustments will be needed anyway.

## Angular blog components and service

The 'blog' folder shall now contain all the needed Angular components.
That is the component with the list of the articles and the one containing the actual article.
You will need a service as well to get the list of articles from the generated list.json.
the blogsuite.js has a small database file (filestore.bin) to retrieve the files for that.
However, it is best to create them first, and overwrite them with the code to have it correctly
registered within Angular in the app.module.
If you want to do all manually in your own structure, you can also create a temporary folder, restore the
files from the filestore.bin there and copy the code. But I think it is better to start with it as described, since
it is easier to change existing code than copying all stuff over.
Create the components with:

```bash
ng generate component blog/article-list
ng generate component blog/blog-item
```
You will also need a service to get the list of articles from the list.json. Create it with:

```bash
ng generate service blog/blog
```
## Restore code from database
Now to restore the files with the needed code is very simple and does not neeed more than the blogsuite.js and the filestore.bin. The
filestore.bin is the database, a binary in which the files with the code are stored.
Now you can execute the blogsuite.js file:
```bash
node blogsuite.js restoredir
```
Now you have to tell blogsuite where the path is, in which the files shall be restored.
For my application it is src/app/blog.
Existing files will be overwritten without warning!

Now check the files if all paths are ok, especially if you adjusted them.

## Create an article
Now you are ready to create new articles.
Execute blogsuite.js simply with the parameter "create":
```bash
node blogsuite.js create
```
The list.json in the same folder will be adjusted.
If for some reason the list.json is not current, you can update it with the parameter "generate-list".
Get a list of available parameter with "help".

## Routing
Now of course you need to integrate the components into the routing of the app.module (or whereever your routing resides).
```bash
      {
        path: 'blog/:slug',
        component: BlogItemComponent,
      },
      {
        path: 'blog',
        component: ArticleListComponent
      }
```
Once the routing is finished, you can easily integrate the article-list within your Angular application.
Like adding a link to the article-list into your site menu or whereever you like it.
Example: '<a href="blog">Blog</a>'.

## Packages 
There might be some packages that need to be installed that are not in your app yet.
You will simply need to check for error messages due to missing packages, and install with:
```bash
npm install <packagename>
```

## Further development
The database file filestore.bin has been created to make the code independant from the article creation.
That way it is possible to create another filestore.bin like for e.g. ReactJS or Vue.js code.
To create another filestorebin, simply use the parameter "storedir". It will ask for the directory which
shall be store. Rename it to something appropiate like "reactjs.bin".  
To restore with another file, simply change the value in blogsuite.js:
```
const binaryFileName = 'filestore.bin';
```
and then execute the blogsuite with parameter "restoredir". It will ask for the directory:
```
node blogsuite restoredir
```
And then there can be a lot of pre-configured file stores, containing all you need to create a simple blog in your web application.




