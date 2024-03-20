start:
	source ../.env && ./gradlew bootrun --args='--spring.profiles.active=local --server.port=8080'

test:
	source ../.env && /usr/bin/time ./gradlew clean build

lint:
	./gradlew ktlintFormat
