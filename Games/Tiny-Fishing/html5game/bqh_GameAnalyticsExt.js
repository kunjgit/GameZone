function configureAvailableCustomDimensions01(json)
{
    gameanalytics.GameAnalytics.configureAvailableCustomDimensions01(JSON.parse(json));
}

function configureAvailableCustomDimensions02(json)
{
    gameanalytics.GameAnalytics.configureAvailableCustomDimensions02(JSON.parse(json));
}

function configureAvailableCustomDimensions03(json)
{
    gameanalytics.GameAnalytics.configureAvailableCustomDimensions03(JSON.parse(json));
}

function configureAvailableResourceCurrencies(json)
{
    gameanalytics.GameAnalytics.configureAvailableResourceCurrencies(JSON.parse(json));
}

function configureAvailableResourceItemTypes(json)
{
    gameanalytics.GameAnalytics.configureAvailableResourceItemTypes(JSON.parse(json));
}

function configureBuild(build)
{
    gameanalytics.GameAnalytics.configureBuild(build);
}

function configureSdkGameEngineVersion(version)
{
    gameanalytics.GameAnalytics.configureSdkGameEngineVersion(version);
}

function configureGameEngineVersion(version)
{
    gameanalytics.GameAnalytics.configureGameEngineVersion(version);
}

function configureUserId(uId)
{
    gameanalytics.GameAnalytics.configureUserId(uId);
}

function initialize(gameKey, gameSecret)
{
    gameanalytics.GameAnalytics.initialize(gameKey, gameSecret);
}

function addBusinessEvent(currency, amount, itemType, itemId, cartType)
{
    gameanalytics.GameAnalytics.addBusinessEvent(currency, amount, itemType, itemId, cartType);
}

function addResourceEvent(flowType, currency, amount, itemType, itemId)
{
    gameanalytics.GameAnalytics.addResourceEvent(parseInt(flowType), currency, amount, itemType, itemId);
}

function addProgressionEvent(status, progression1, progression2, progression3)
{
    gameanalytics.GameAnalytics.addProgressionEvent(parseInt(status), progression1, progression2, progression3);
}

function addProgressionEventWithScore(status, progression1, progression2, progression3, score)
{
    gameanalytics.GameAnalytics.addProgressionEvent(parseInt(status), progression1, progression2, progression3, score);
}

function addDesignEvent(eventId)
{
    gameanalytics.GameAnalytics.addDesignEvent(eventId);
}

function addDesignEventWithValue(eventId, value)
{
    gameanalytics.GameAnalytics.addDesignEvent(eventId, value);
}

function addErrorEvent(severity, message)
{
    gameanalytics.GameAnalytics.addErrorEvent(parseInt(severity), message);
}

function setEnabledInfoLog(flag)
{
    gameanalytics.GameAnalytics.setEnabledInfoLog(!!flag);
}

function setEnabledVerboseLog(flag)
{
    gameanalytics.GameAnalytics.setEnabledVerboseLog(!!flag);
}

function setEnabledManualSessionHandling(flag)
{
    gameanalytics.GameAnalytics.setEnabledManualSessionHandling(!!flag);
}

function setCustomDimension01(dimension)
{
    gameanalytics.GameAnalytics.setCustomDimension01(dimension);
}

function setCustomDimension02(dimension)
{
    gameanalytics.GameAnalytics.setCustomDimension02(dimension);
}

function setCustomDimension03(dimension)
{
    gameanalytics.GameAnalytics.setCustomDimension03(dimension);
}

function setFacebookId(id)
{
    gameanalytics.GameAnalytics.setFacebookId(id);
}

function setGender(gender)
{
    gameanalytics.GameAnalytics.setGender(parseInt(gender));
}

function setBirthYear(year)
{
    gameanalytics.GameAnalytics.setBirthYear(parseInt(year));
}

function startSession()
{
    gameanalytics.GameAnalytics.startSession();
}

function endSession()
{
    gameanalytics.GameAnalytics.endSession();
}

function onStop()
{
    gameanalytics.GameAnalytics.onStop();
}

function onResume()
{
    gameanalytics.GameAnalytics.onResume();
}
