import { expect, test } from '../fixtures/base';

test('User compare reksa dana product', async ({ page, homePage, reksaDanaPage }) => {
  await test.step('Open cermati.com', () => homePage.goto());

  await test.step('Open Investasi dropdown and verify options are visible', async () => {
    await homePage.clickInvestasiDropdown();
    await expect(homePage.emasDigitalButton).toBeVisible();
  });

  await test.step('Click Reksa Dana and verify redirect to /reksadana', async () => {
    await homePage.clickReksaDana();
    await expect(page).toHaveURL(/.*\/reksadana/);
  });

  await test.step('Click Reksa Dana Pasar Uang and verify redirect to /reksadana/pasar-uang', async () => {
    await reksaDanaPage.clickReksaDanaPasarUang();
    await expect(page).toHaveURL(/.*\/reksadana\/pasar-uang/);
  });

  await test.step('Compare Reksa Dana Pasar Uang Syariah and verify redirect to /reksadana/bandingkan', async () => {
    await reksaDanaPage.clickFilterButton();
    await reksaDanaPage.clickSyariahCheckBox();
    await reksaDanaPage.clickTerapkanButton();
    await reksaDanaPage.clickBandingkanButton();
    await reksaDanaPage.compareReksaDanaPasarUangSyariah();
    await reksaDanaPage.clickBandingkanApplyButton();
    await expect(page).toHaveURL(/.*\/reksadana\/bandingkan/);
  });

  await test.step('Verify user is in Reksa Dana detail page', async () => {
    await expect(reksaDanaPage.cagr1Tahun).toBeVisible();
  });
});

test('User validate search result and category', async ({ page, homePage, searchPage }) => {
  await test.step('Open cermati.com', () => homePage.goto());

  await test.step('Search "BCA" and verify search parameter appears in URL', async () => {
    const searchTerm = 'BCA';
    await homePage.searchProduct(searchTerm);
    await expect(page).toHaveURL(new RegExp(`/cari\\?term=.*${encodeURIComponent(searchTerm)}`, 'i'));
  });

  await test.step('Verify category counts sum matches search result count', async () => {
    const searchResultCount = await searchPage.getSearchResultCount();
    const categoryTotalCount = await searchPage.getCategoryTotalCount();
    expect(categoryTotalCount).toBe(searchResultCount);
  });
});
