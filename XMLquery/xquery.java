package org.me;

/**
 * Created by dollyd on 2/6/17.
 */
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

import javax.xml.xquery.XQConnection;
import javax.xml.xquery.XQDataSource;
import javax.xml.xquery.XQException;
import javax.xml.xquery.XQPreparedExpression;
import javax.xml.xquery.XQResultSequence;

import com.saxonica.xqj.SaxonXQDataSource;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class xquery {
    /*args:
    titles:     Select all the article titles;
    firstTitle: Select the title of the first article;
    authors:    Select all the authors;
    year2010:   Select article nodes with publication data later than 2010;
    return in the first 3,000 publication records;  
    */
    public static void main(String[] args) {
        String query = args[0] ;
        xquery test = new xquery();
        try {
            test.excute(query);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (XQException e) {
            e.printStackTrace();
        }
    }

    private static void excute(String type) throws FileNotFoundException, XQException {
        String xqueryFile = type+".xqy";
        InputStream inputStream = new FileInputStream(new File(xqueryFile));
        XQDataSource ds = new SaxonXQDataSource();
        XQConnection conn = ds.getConnection();
        XQPreparedExpression exp = conn.prepareExpression(inputStream);
        XQResultSequence result = exp.executeQuery();


        while (result.next()) {
            System.out.println(result.getItemAsString(null));
        }
    }
}
