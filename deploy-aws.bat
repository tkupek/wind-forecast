del bundle.zip
jovo deploy --target zip
aws lambda update-function-code --function-name wind-forecast --zip-file fileb://bundle.zip