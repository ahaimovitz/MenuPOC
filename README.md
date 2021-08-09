# MenuPOC

Run the following to import the menu data:
firebase emulators:start --import=menudata

Then go to your apollo console and run the queries:

http://localhost:5001/menuservices/us-central1/graphql

Queries to try:

# Get categories with Availability

{
  categories{
    id
    products{
      availability{
        always
      }
    }
  }
}

# Get the same data, now get the category name and also  with "availability" now flag

{
 categories
 	{id
  name
  products{
    id
    name
    availability{
      now
      always
    }
  }}
  }

# do some schema introspections
{
  __schema {
    types {
      name
    }
  }
}

