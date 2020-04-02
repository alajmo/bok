layout: pages/post.ts
type: post
date: 2016-01-11
title: Using jsonb in Postgres and Making it Work with BI Software by Leveraging Views
---

Json (or more recently Jsonb) is a great addition to Postgres, and soon many other established SQL solutions will follow suit. It enables us to relax some of the conditions relational
databases come with, such as enforcing a schema (perhaps where no schema is to be found) or having a predefined type.
For me, one of the biggest problems it helps tackle is situations where you are faced with a varying number of attributes, usually needed to be dynamically added / removed by the end user.
Old solutions include the dreading EAV (entity-attribute-value) model, which treats each additional column or attribute as a row in a table.

However, this anti-pattern comes with several issues. First of, it's incredibly tedious to do basic queries on the columns row-wise since you must do inner and outer joins when
more than one attributes and the AND constraint is involved. Secondly, since your table now consists of only 3 columns (the entity, the attribute and the value),
you are forced to put value type to text in order to allow different types of values. The alternative would be to either create 4 columns, where you have 2 value columns,
in which one of them is always zero, or create x tables, one for each of the types you plan to use.

So, jsonb to the rescue? Well, kind of. While it enables us to more quickly prototype and handle data without defining a scheme beforehand,
the landscape of statistical and analysis software contain programs that simply don't have support for json documents, and so, we are
forced to backtrack to plain old tables in many instances.

However, there is at least one way you could have the best of both worlds, and that is to leverage Postgresql's type jsonb along with constructing
views based on those fields. Below is a short code snippet that demonstrates this in python.

```python

def jsonb_to_sql_view(conn, table_name):
    """Create SQL view from a table that contains a jsonb column.
        @param conn Postgres connection.
        @param table_name Table name containing the jsonb.
    """


    cur = conn.cursor()

    # Retrieve the column names you want to use. This is actually not needed
    # as you could leverage the key names contained within the jsonb or use
    # the column1, column2 etc provided by postgresql.
    cur.execute("SELECT keys FROM column_name WHERE table_name = '{}'"
        .format(table_name))
    keys = cur.fetchall()[0][0]

    view = 'DROP VIEW IF EXISTS {}_v;\n'.format(table_name)
    view += 'CREATE OR REPLACE VIEW {}_v AS\n SELECT\n'.format(table_name)

    for (i, key) in enumerate(keys):
        # Check if it is the last key to not add trailing comma
        if i == (len(keys.keys()) - 1):
            view +=  '(jsonb_data ->> \'{}\')::{} AS "{}" \n'
                .format(key, keys[key], key)
        else:
            view +=  '(jsonb_data ->> \'{}\')::{} AS "{}",\n'
                .format(key, keys[key], key)

    view += ' FROM {};\n\n'.format(table_name)

    cur.execute(view)
    conn.commit()

```

