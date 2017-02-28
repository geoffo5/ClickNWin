import DBcm
import decimal

config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'srtb19',
    'database': 'clicknwin',
}

def checkUsername(username):
    _SQL = """SELECT username FROM users WHERE username = '{username}';""".format(username = username)
    with DBcm.UseDatabase(config) as database:
        database.execute(_SQL)
        user = database.fetchall()
    if len(user):
        return True
    return False    


def addUser(user):
    duplicate = checkUsername(user['username'])
    if duplicate:
        return False
    
    _SQL = """INSERT INTO users
            (username, password, firstname, lastname, email, phone, birthdate, balance)
            values
            (%s, %s, %s, %s, %s, %s, %s, 0.00)"""
    with DBcm.UseDatabase(config) as database:
        database.execute(_SQL, (user['username'], user['password'], user['firstname'], user['lastname'], user['email'],
                        user['phone'], user['dob']))
    return True

def login(username, password):
    _SQL = """SELECT username,password FROM users WHERE username = '{username}';""".format(username = username)
    with DBcm.UseDatabase(config) as database:
        database.execute(_SQL)
        user = database.fetchall()
   
    if not len(user):
        return False
    elif user[0][1] != password:
        return False

    return True

def getBalance(username):
    _SQL = """SELECT balance FROM users WHERE username = '{username}';""".format(username = username)
    with DBcm.UseDatabase(config) as database:
        database.execute(_SQL)
        balance = database.fetchall()

    return balance[0][0]

def addPaymentCard(card):
    _SQL = """INSERT INTO paymentcards
            (cardNumber, expiryMonth, expiryYear, cardType, cardHolderName, user)
            values
            (%s, %s, %s, %s, %s, %s)"""

    with DBcm.UseDatabase(config) as database:
        database.execute(_SQL, (str(card['cardNumber']),str(card['expiryMonths']),str(card['expiryYears']), card['cardType'],card['cardName'], card['user']))

def getCardTypes():
    _SQL = """SELECT name, price FROM cardTypes"""
    
    with DBcm.UseDatabase(config) as database:
        database.execute(_SQL)
        cards = database.fetchall()
    return cards

def getPrizes(type):
    _SQL = """SELECT * FROM cardTypes WHERE name = '{type}';""".format(type=type)
    
    with DBcm.UseDatabase(config) as database:
        database.execute(_SQL)
        prizes = database.fetchall()
    return prizes

def getPrice(name):
    _SQL = """SELECT price FROM cardtypes WHERE name = '{name}';""".format(name=name)

    with DBcm.UseDatabase(config) as database:
        database.execute(_SQL)
        price = database.fetchall()
    return price

def addScratchCard(card):
    _SQL = """INSERT INTO scratchcards
            (user, prize, type, boughtBy)
            values
            (%s, %s, %s, %s)"""

    with DBcm.UseDatabase(config) as database:
        database.execute(_SQL, (card['user'], card['prize'], card['type'], card['boughtBy']))

def reduceBalance(user, price):
    balance = float(getBalance(user))
    newBal = balance - float(price[1:])
    newBal = decimal.Decimal(newBal)
    
    _SQL = """UPDATE users SET balance = '{newBal}' WHERE username = '{user}';""".format(user = user, newBal = newBal)

    with DBcm.UseDatabase(config) as database:
        database.execute(_SQL)


    