import json
import sys
import logging
import pymysql
import datetime

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
  print('received event:')
  print(event)
  

  args = event['arguments']
  inp = args['input']
  
  clientid = inp['clientid']
  frequency = inp['frequency']
  ddtype = inp['ddtype']
  lte = inp['lte']
  
  logger.info(" insert IGNORE into defaults(clientid, LTE, frequency, type) values( '" + clientid + "','" + lte +  "','" + frequency +  "','" + ddtype + "')")
  with conn.cursor() as cur:
    cur.execute(" insert IGNORE into defaults(clientid, LTE, frequency, type) values( '" + clientid + "','" + lte +  "','" + frequency +  "','" + ddtype + "')" )
    cur.execute(" update defaults set lte = '" + lte + "', frequency = '" + frequency + "', type = '" + ddtype + "' where clientid = '" + clientid + "'" )
  conn.commit()


  return {
    'result': '200'
    
  }