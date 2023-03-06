# All The Sets

A very simple web service to provide the unique prime forms of Pitch-Class Sets
as listed in Appendix 1 of [Allen Forte's The Structure Of Atonal
Music](https://books.google.de/books/about/The_Structure_of_Atonal_Music.html?id=j9aV2JYHY4AC&redir_esc=y)
as a REST api. 

## Usage

This service is hosted [on Render](https://all-the-sets.onrender.com): https://all-the-sets.onrender.com

### API
| route | |
|--|--|
| / | returns the complete list of prime forms |
| /set/:name | Where name is the classification that Allen Forte uses, for example 3-3 or 5-1 | 
| /size/:size | Returns all the prime forms of Pitch-Class sets with a given size | 

## Running locally
After cloning this repo
```
npm install && node server.js
```
