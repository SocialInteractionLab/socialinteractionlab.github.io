# coding: utf-8

# # Publications markdown generator for academicpages
# 
# Takes a TSV of publications with metadata and converts them for use with [academicpages.github.io](academicpages.github.io). This is an interactive Jupyter notebook, with the core python code in publications.py. Run either from the `markdown_generator` folder after replacing `publications.tsv` with one that fits your format.
# 
# TODO: Make this work with BibTex and other databases of citations, rather than Stuart's non-standard TSV format and citation style.
# 

# ## Data format
# 
# The TSV needs to have the following columns: pub_date, title, venue, excerpt, citation, site_url, and paper_url, with a header at the top. 
# 
# - `excerpt` and `paper_url` can be blank, but the others must have values. 
# - `pub_date` must be formatted as YYYY-MM-DD.
# - `url_slug` will be the descriptive part of the .md file and the permalink URL for the page about the paper. The .md file will be `YYYY-MM-DD-[url_slug].md` and the permalink will be `https://[yourdomain]/publications/YYYY-MM-DD-[url_slug]`


# ## Import pandas
# 
# We are using the very handy pandas library for dataframes.

import pandas as pd


# ## Import TSV
# 
# Pandas makes this easy with the read_csv function. We are using a TSV, so we specify the separator as a tab, or `\t`.
# 
# I found it important to put this data in a tab-separated values format, because there are a lot of commas in this kind of data and comma-separated values can get messed up. However, you can modify the import statement, as pandas also has read_excel(), read_json(), and others.

publications = pd.read_csv("publications.tsv", sep="\t", header=0)


# ## Escape special characters
# 
# YAML is very picky about how it takes a valid string, so we are replacing single and double quotes (and ampersands) with their HTML encoded equivilents. This makes them look not so readable in raw format, but they are parsed and rendered nicely.

html_escape_table = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;"
    }

def html_escape(text):
    """Produce entities within text."""
    # Check if the text is a string before processing
    if isinstance(text, str):
        return "".join(html_escape_table.get(c,c) for c in text)
    else:
        return text


# ## Creating the markdown files

import os
for row, item in publications.iterrows():
    
    ## YAML variables
    
    md = "---\ntitle: \""   + html_escape(item.title) + '"\n'
    
    md += """collection: publications"""
    
    # Create the permalink from the date and url_slug
    html_filename = str(item.pub_date) + "-" + item.url_slug
    md += """\npermalink: /publication/""" + html_filename
    
    # Add excerpt if it exists
    if len(str(item.excerpt)) > 5:
        md += "\nexcerpt: '" + html_escape(item.excerpt) + "'"
    
    md += "\ndate: " + str(item.pub_date) 
    
    md += "\nvenue: '" + html_escape(item.venue) + "'"
    
    # Add paper_url if it exists
    if len(str(item.paper_url)) > 5:
        md += "\npaperurl: '" + item.paper_url + "'"
    
    md += "\ncitation: '" + html_escape(item.citation) + "'"
    
    md += "\n---"
    
    ## Markdown description for individual page
    
    if len(str(item.paper_url)) > 5:
        md += "\n\n<a href='" + item.paper_url + "'>Download paper here</a>\n" 
        
    if len(str(item.excerpt)) > 5:
        md += "\n" + html_escape(item.excerpt) + "\n"
        
    md += "\nRecommended citation: " + item.citation
    
    # Create the markdown filename from the date and url_slug
    md_filename = str(item.pub_date) + "-" + item.url_slug + ".md"
       
    # Write the file to the correct _papers directory
    with open("../_papers/" + md_filename, 'w') as f:
        f.write(md)

print("Markdown files generated successfully in the _papers folder.")