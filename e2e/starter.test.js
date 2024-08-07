describe('App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should render the topics -> subtopics -> bilingual text', async () => {
    const foodTopic = 'food';
    const moreTopics = 'More Topics';
    const displaySettingsId = 'display-settings';
    const foodSubTopics = ['food-01', 'food-02', 'food-03'];
    const foodTopicEl = element(by.id(foodTopic));
    const moreTopicsEl = element(by.text(moreTopics));
    await expect(moreTopicsEl).toBeNotVisible();
    for (const foodEl of foodSubTopics) {
      await expect(element(by.id(foodEl))).toBeNotVisible();
    }
    await expect(foodTopicEl).toBeVisible();
    await foodTopicEl.tap();
    await expect(element(by.id(foodSubTopics[0]))).toBeVisible();
    for (const foodEl of foodSubTopics) {
      await expect(element(by.id(foodEl))).toBeVisible();
    }
    await expect(moreTopicsEl).toBeVisible();

    const firstEl = element(by.id(foodSubTopics[0]));
    await firstEl.tap();

    // loading page
    // const topicLoader = 'topic-loader';
    // const topicLoaderEl = element(by.id(topicLoader));
    // await waitFor(topicLoaderEl).toBeVisible();

    const displaySettingsIdEl = element(by.id(displaySettingsId));
    await waitFor(displaySettingsIdEl).toBeVisible().withTimeout(5000);
  });
});
