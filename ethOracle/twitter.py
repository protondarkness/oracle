
import tweepy

import os
API='dNj06a2xlrCzhM68mGYTnn04m'
API_S='brzRECb4fjrv0jvklbSoZ2xkIwqT0bUFHNuPrs5Azph8nSbzVT'
AT='2762947087-yQAto6SefAAwRBNE5xpeowaHdGSaj0Rw2lHAd1T'
AT_S='hccByTNHUvX69Tdh9LIAQH702ahODvCayYSDjdYdl4yr5'
B='AAAAAAAAAAAAAAAAAAAAAAh%2BiwEAAAAAxMiqULPqo5Yie8DPu%2BHYJtdQ8n8%3D7NG1V4tyjbtPBM6uvNRgx44PHywPOMONGPgzxulgDZrllvQzjE'
OA='dDViMlczZVZxcC1JQjhiOHlMWEY6MTpjaQ'
OA_S='JzUshmJ1CCt376SSeOuETlHClBN_8Q0LF3CogS3P_JBna11FKh'
BEARER='AAAAAAAAAAAAAAAAAAAAAI9ciwEAAAAAYyD0SwXCM6YA9IslJGkIDQdCeiA%3DlH4C1bZgz9OWePS7MobBQRX5FFXdtRUcoORP6xRCxZnbaCKmzI'

# apikey=os.getenv('API')
# apisecret = os.getenv('API_S')
# acesstoken =os.getenv('AT')
# aceessecret = os.getenv('AT_S')
# bearer =os.getenv('B')
# consumer_key = os.getenv('OA')
# consumer_secret = os.getenv('OA_S')
# print(consumer_key)
client = tweepy.Client(bearer_token=B)

auth = tweepy.OAuthHandler(API, API_S)
auth.set_access_token(AT, AT_S)
api = tweepy.API(auth)
# available_loc = api.available_trends()
def getListOfTrends():
    woeid = 23424977
    # writing a JSON file that has the available trends around the world
    # print(available_loc)
    trends =api.get_place_trends(woeid)
    print(len(trends[0]['trends']))
    for t in trends[0]['trends']:
        print(t)

def getListOfUser(userID):
    #userID = "alifarhat79"
    tweets = api.user_timeline(screen_name=userID,
                               # 200 is the maximum allowed count
                               count=10,
                               include_rts=True,
                               # Necessary to keep full_text
                               # otherwise only the first 140 words are extracted
                               tweet_mode='extended'
                               )
    for info in tweets[:3]:
        print("ID: {}".format(info.id))
        print(info.created_at)
        print(info.full_text)
        print("\n")


def getListOFretweetsOfKeyword(tweetID):
    #ID = 1265889240300257280
    # getting the retweeters
    #retweets_list = api.get_retweets(tweetID)
    status = api.get_status(tweetID, tweet_mode="extended")
    retweetedCount= status.retweet_count
    favoritedCount = status.favorite_count
    print(status)
    print(retweetedCount)

def getCountOfHashtags(hashtag, tf,start_t=0,end_t=0):
    '''timeframe can be day,hourly 15minute etc'''
    #datetime in YYYY-MM-DDTHH:mm:ssZ (ISO 8601/RFC 3339).
    timeframe = {1: 'day', 2: 'hour', 3:'minute'}
    #time in thisformat 2022-11-03T17:56:00.000Z
    startTime=start_t
    endTime=end_t
    #below specifies no retweet,
    #query = '{htag} -is:retweet'.format(htag=hashtag)
    query = '{htag}'.format(htag=hashtag)
    client = tweepy.Client(bearer_token=BEARER)
    if startTime != 0 and endTime != 0:
        counts = client.get_recent_tweets_count(query=query, granularity=timeframe[tf],end_time=endTime, start_time=startTime)
    else:
        counts = client.get_recent_tweets_count(query=query, granularity=timeframe[tf])
    for count in counts.data:
        print(count)

#getListOFretweetsOfKeyword(1587668890871529472)
#getListOfTrends()
getCountOfHashtags('stoneocean',2)