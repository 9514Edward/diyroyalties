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
  royToGet = inp['royToGet']
  endDate = inp['endDate']
  logger.info(endDate)
  logger.info(royToGet)
  royToGetJson = json.loads(royToGet)
  title =royToGetJson['label']
  statementId = royToGetJson['value']
  logger.info(statementId)


#			String mm, yy;
	
#			//If Advance has been earned
#			if(AdvancePaid < System.Convert.ToDateTime("01-01-2299") && AdvancePaid < EndDate)
#			{
#				//And there is not a negative balance before the end of the current period 
#				//And there is not a date positive after the date negative.
#				if(DateNeg > AdvancePaid && DateNeg < EndDate)
#				{
#					PeriodBegin = DateNeg.AddDays(-1);
#				}
#				else
#					if(LastRun == EndDate) //Re-running
#				{
#					//First get the year
#					yy = LastRun.Year.ToString();
#					//Get the first of the next month
#					PeriodBegin = LastRun.AddMonths(-1*MonthsInterval).AddDays(3);
#					mm = PeriodBegin.Month.ToString().PadLeft(2,System.Convert.ToChar("0"));
#					PeriodBegin = System.Convert.ToDateTime( mm + "-01-"+ "-" + yy);
#					PeriodBegin = PeriodBegin.AddDays(-1);
#				}
#				else//Normal
#					PeriodBegin = LastRun;
#			}
#			else//advance not earned  //still use the period, but later will add Prior
#			{
#				//				if(LastRun == EndDate)//First time running the statement
#				//				{
#
#				//Get the first of the next month
#				//EF CHANGED THIS RECENTLY
#				//PeriodBegin = LastRun.AddMonths(-1*MonthsInterval).AddDays(3);
#				PeriodBegin = LastRun.AddDays(3);
#				//First get the year
#				yy = PeriodBegin.Year.ToString();				
#				mm = PeriodBegin.Month.ToString().PadLeft(2,System.Convert.ToChar("0"));
#				//And subtract one day
#				PeriodBegin = System.Convert.ToDateTime(mm + "-01-" + yy);
#				PeriodBegin = PeriodBegin.AddDays(-1);
#				//				}
#				//				else//Pubdate or before
#			}



  
  with conn.cursor() as cur:
    cur.execute(" select   `StatementID`,  `ContractID`,  `RecRef`,  rtrim(`Name`) as Name,  `Interval`,  `TransferISBN` ,  `RoyaltyCodes`,   DATE_FORMAT(AdvancePaid, '%Y-%m-%d') as AdvancePaid,   DATE_FORMAT(`DateNeg`, '%Y-%m-%d') as DateNeg,   DATE_FORMAT(`DatePos`, '%Y-%m-%d') as DatePos,  `Authorid`  ,  `Agentid`  ,   convert(`Reserve`, char) as Reserve,   convert(`Reserve2`, char) as Reserve2,   convert(`Reserve3`, char) as Reserve3,  `Note`,   convert(`BottomLineMultiplier`, char) as BottomLineMultiplier,  `BottomLineText` ,  `ShowUnitsHistory`,  `DoNotPay`,  `RatesAsDollars`,   convert(`rate47`, char) as Rate47 ,   convert(`rate48`, char) as Rate48,   convert(`rate50`, char) as Rate50,   convert(`rate60`, char) as Rate60,  `checkgte`  ,  `NU` ,  `NPU` ,  `NPUXD`  ,  `MiscText`,   convert(`MiscAmount`, char) as MiscAmount ,  `TemplateName`,   convert(`ReserveOverride`, char) as ReserveOverride ,   convert(`ReserveOverride2`, char) as ReserveOverride2 ,   convert(`ReserveOverride3`, char) as ReserveOverride3 ,  `NoRoll`  ,   DATE_FORMAT(`FinalDate`, '%Y-%m-%d') as FinalDate,  `Domestic2Desc`,  `Domestic3Desc`,  `AccrualRule` ,  `PayonRule`,  `DisplayWhatRule` ,  `RollupRule`  ,  `MaximumDiscountRule` ,  `LTERule`  ,   DATE_FORMAT(`LastRun`, '%Y-%m-%d') as LastRun,  `MonthsInterval`  ,   convert(`AdvanceAmount`, char) as AdvanceAmount,  convert(`PriorWriteoff`, char) as PriorWriteoff,  convert(`CurrentWriteoff`, char) as CurrentWriteoff , `clientid`  from statements where statementID = " + str(statementId))
    settings = cur.fetchone()
  conn.commit()
  
  logger.info(settings)
  AdvancePaid_str = settings[7]
  DateNeg_str = settings[8]
  LastRun_str = settings[45]
  logger.info('advance paid, end date')
  logger.info(AdvancePaid_str)

  logger.info(endDate)
  if AdvancePaid_str is not None:
    AdvancePaid_obj = datetime.datetime.strptime(AdvancePaid_str, '%Y-%m-%d')
  else:
    AdvancePaid_obj = datetime.datetime.max
    
  DateNeg_obj = datetime.datetime.min
  PeriodBegin_obj = datetime.datetime.min
  EndDate_obj = datetime.datetime.strptime(endDate, '%Y-%m-%d')
  LastRun_obj = datetime.datetime.strptime(LastRun_str, '%Y-%m-%d')
  
  with conn.cursor() as cur:
    cur.execute("select  AccrualBegin from statementaccrualdate where Statementid = " + str(statementId)  + " and CloseDate = '" + endDate + "'")
    AccrualBegin = cur.fetchone()
    if cur.rowcount == 1:
      DateNeg_obj = AccrualBegin[0]
  conn.commit()
  
  
  
  if AdvancePaid_obj < datetime.datetime.max and AdvancePaid_obj < EndDate_obj :
    logger.info('hi1')
    if DateNeg_obj > AdvancePaid_obj and DateNeg_obj < EndDate_obj :
      logger.info('hi2')
      PeriodBegin_obj = DateNeg_obj - datetime.timedelta(days=1)
      logger.info('PeriodBegin')
      logger.info(DateNeg_obj)
    elif LastRun_obj == EndDate_obj : 
      PeriodBegin_obj = (LastRun_obj.replace(day=1) + datetime.timedelta(days=32)).replace(day=1)
      logger.info('hi3')
  else:
    logger.info('hi4')
    PeriodBegin_obj = LastRun_obj;
  logger.info('PeriodBegin: ')
  
  logger.info(PeriodBegin_obj)
    
  with conn.cursor() as cur:
    cur.execute("select recref, DATE_FORMAT(invdate, '%Y-%m-%d') as invdate, class, saleunits, rtnunits, CONVERT(saledollars, char) as saledollars, CONVERT(rtndollars, char) as rtndollars, CONVERT(discount, char) as discount from invoices where recref = " + str(settings[2]) + " and invdate between '" + PeriodBegin_obj.strftime("%Y-%m-%d") + "' and '" + EndDate_obj.strftime("%Y-%m-%d") + "'")
    invoices = cur.fetchall()
  conn.commit()    

  with conn.cursor() as cur:
    cur.execute("select recref, DATE_FORMAT(invdate, '%Y-%m-%d') as invdate, class, saleunits, rtnunits, CONVERT(saledollars, char) as saledollars, CONVERT(rtndollars, char) as rtndollars, CONVERT(discount, char) as discount from invoices where recref = " + str(settings[2]) + " and invdate < '" + PeriodBegin_obj.strftime("%Y-%m-%d") + "'")
    priorsales = cur.fetchall()
  conn.commit()    

    
  with conn.cursor() as cur:
    cur.execute("select `StatementID`, `SaleType`, `IsDefault`, convert(`RoyaltyRate`,char) as RoyaltyRate, convert(`CurrentDollars`, char) as CurrentDollars, `CurrentUnits`, convert(`Cuttoff1`, char) as Cuttoff1, convert(`Rate1`, char) as Rate1, convert(`CurrentDollars1`,char) as CurrentDollars1, `CurrentUnits1`, convert(`Cuttoff2`, char) as Cuttoff2, convert(`Rate2`, char) as Rate2, convert(`CurrentDollars2`, char) as CurrentDollars2, `CurrentUnits2`, convert(`Cuttoff3`, char) as Cuttoff3, convert(`Rate3`, char) as Rate3, convert(`CurrentDollars3`, char) as CurrentDollars3, `CurrentUnits3`, `PrintingCuttoff`, convert(`PrintingOverPerc`, char) as PrintingOverPerc, convert(`PrintingUnderPerc`, char) as PrintingUnderPerc, `IsReserve`, `EscalationUnitsUpTo`, `clientid` from royaltyrates where StatementID = " + str(statementId))
    royaltyrates = cur.fetchall()
  conn.commit()    


  with conn.cursor() as cur:
    cur.execute("select `Statementid`, DATE_FORMAT(`TransDate`, '%Y-%m-%d') as TransDate, CONVERT(`Reserve1`, char) as Reserve1, CONVERT(`Reserve2`, char) as Reserve2, CONVERT(`Reserve3`, char) as Reserve3, CONVERT(`Reserve4`, char) as Reserve4, CONVERT(`Reserve5`, char) as Reserve5, CONVERT(`Reserve6`, char) as Reserve6, CONVERT(`Advance`, char) as Advance, CONVERT(`Adjustment`, char) as Adjustment, `AdjustmentComment`, `SaleType`, CONVERT(`AdvanceWriteOff`, char) as AdvanceWriteOff from statementtrans where StatementID = " + str(statementId) +  " and TransDate = '"  + PeriodBegin_obj.strftime("%Y-%m-%d") + "'")
    startingpoint = cur.fetchall()
  conn.commit()    

  return {
    'settings': json.dumps(settings),
    'invoices': json.dumps(invoices),
    'priorsales': json.dumps(priorsales),
    'royaltyrates': json.dumps(royaltyrates),
    'startingpoint': json.dumps(startingpoint)
    
  }