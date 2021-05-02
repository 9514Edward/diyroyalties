import json
import sys
import logging
import pymysql
#rds settings
rds_host  = "rizz2.cyax1patkaio.us-east-1.rds.amazonaws.com"
name = 'c6xvsSTa'
password ='dhqDjL,vw7t!y%RY'
db_name = 'royaltyrun'

logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn = pymysql.connect(host=rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit()

logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")
def handler(event, context):
    """
    This function fetches content from MySQL RDS instance
    """
    
    args = event['arguments']
    inp = args['input']
    clientId = inp['clientId']
    search = inp['search']
    logger.info(clientId)
    logger.info(search)
    
    
    item_count = 1

    with conn.cursor() as cur:
        cur.execute("SELECT  COALESCE(rtrim(statements.TransferISBN), '') AS TransferISBN, statements.StatementID, statements.MonthsInterval, rtrim(DistinctiveTitle) as DistinctiveTitle, edimaster.ISBN, DATE_FORMAT(edimaster.PublicationDate, '%Y-%m-%d') as PublicationDate, clients.name, clients.address1, clients.address2, clients.address3, statements.Agentid, statements.Authorid, authors.PersonName, authors.Add1, authors.Add2, authors.Add3, authors.Add4, authors.Add5, authors.State, authors.Zip, authors.Zip4, authors.Country, authors.Attention, agents.AgentName, agents.AgentAdd1, agents.AgentAdd2, agents.AgentAdd3, agents.agentstate, agents.AgentZip, agents.AgentCountry, agents.AgentAttn, DATE_FORMAT(COALESCE(statements.FinalDate, '3000-01-01'), '%Y-%m-%d') AS FinalDate, COALESCE(statements.LastRun, '3000-01-01') as LastRun, convert(statements.AdvanceAmount, char) as AdvanceAmount, statements.ContractID FROM  clients CROSS JOIN  statements LEFT OUTER JOIN authors ON authors.AuthorID = statements.Authorid LEFT OUTER JOIN agents ON agents.AgentID = statements.Agentid LEFT OUTER JOIN edimaster ON edimaster.recref = statements.RecRef WHERE  COALESCE(finaldate,'2020-12-31') >= '2020-12-31' and COALESCE(transferISBN,'') = '' and statements.ContractID IS NOT NULL and clients.clientid = '18c67da7-a451-11' order by distinctivetitle, COALESCE(AgentName,PersonName)")
        body = cur.fetchall()
    conn.commit()

    return {
        'body': json.dumps(body)
    }