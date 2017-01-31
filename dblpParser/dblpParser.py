import xml.sax
from py2neo import authenticate, Graph, Node, Relationship


class DBLPHandler(xml.sax.ContentHandler):
    def __init__(self):
        self.graph = self.neograph()    # neo4j graph
        self.level = 0                  # parsing level of element
        self.doc_num = 0                # number of paper
        self.currentPaper = None
        self.currentTag = ""
        self.paper_detail = {}          # dict: key value
        self.author_list = []           # list: name string


    def neograph(self):
        authenticate("localhost:7474", "neo4j", "dxy")
        return Graph("http://localhost:7474/dblp")

    # Call when an element starts
    def startElement(self, tag, attributes):
        # print("start:"+tag)
        self.level += 1
        self.currentTag = tag
        if self.doc_num > 5000:
            raise Exception("beyond limit")     # stop parsing at 5000th paper
        if self.level == 2:
            self.doc_num += 1                   # start to parse a new paper
            self.currentPaper = Node("Paper", id=attributes["key"])  # create neo4j Node with label "Paper"
            # print(self.currentPaper.properties["id"])

    # Call when an elements ends
    def endElement(self, tag):
        # print("end:" + tag)
        if self.level == 2:
            # print("create node paper:" + self.currentPaper["id"])
            self.papernode()
            # print("endelement:", self.currentPaper.properties)
            for a in self.author_list:
                self.graph.create(Relationship(a, "PUBLISH", self.currentPaper))    # create relationships in neo4j
            self.currentPaper = None
            self.paper_detail = {}
            self.author_list = []
        self.level -= 1

    # Call when a character is read
    def characters(self, content):
        if content != "\n":
            if self.currentTag == "author":
                author = Node("Author", name=content)   # create neo4j Node with label "Author"
                self.author_list.append(author)
            elif self.level == 3:
                self.paper_detail[self.currentTag] = content    # properties of paper

    def papernode(self):
        keys = self.paper_detail.keys()
        for key in keys:
            self.currentPaper[key] = self.paper_detail[key]     # properties of Node paper


if (__name__ == "__main__"):
    # create an XMLReader
    parser = xml.sax.make_parser()
    # turn off namepsaces
    parser.setFeature(xml.sax.handler.feature_namespaces, 0)

    # override the default ContextHandler
    Handler = DBLPHandler()
    parser.setContentHandler(Handler)

    parser.parse("newdblp.xml")