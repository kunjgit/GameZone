import java.util.Scanner;
public class CountSubarraysWithMedian {
  public static int countSubarraysWithMedian(int[] array, int n, int k) {
    int count = 0;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j <= n; j++) {
        if (getMedian(array, i, j) == k) {
          count++;
        }
      }
    }
    return count;
  }
  private static int getMedian(int[] array, int i, int j) {
    int middle = (i + j) / 2;
    if (j % 2 == 0) {
      return (array[middle] + array[middle - 1]) / 2;
    } else {
      return array[middle];                                                                                                     
    }
  }
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    int[] array = new int[n];
    for (int i = 0; i < n; i++) {
      array[i] = scanner.nextInt();
    }
    int k = scanner.nextInt();
    int count = countSubarraysWithMedian(array, n, k);
    System.out.println(count);
  }
}