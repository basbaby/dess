serverId=nexus-snapshots
serverUsername="admin"
serverPassword="NjcNexus@123"
archeProfileId="acme"
archeTypeRepoId="archetype"
archeTypeRepoUrl="http://104.248.169.167:8081/repository/maven-snapshots/"
echo "<server>

    <id>${serverId}</id>
    <username>${serverUsername}</username>
    <password>${serverPassword}</password>

</server>

    <profile>

    <id>${archeProfileId}</id>
    <repositories>
    <repository>
    <id>${archeTypeRepoId}</id>
    <url>${archeTypeRepoUrl}</url>
    <releases>
    <enabled>true</enabled>
    <checksumPolicy>fail</checksumPolicy>
    </releases>
    <snapshots>
    <enabled>true</enabled>
    <checksumPolicy>warn</checksumPolicy>
    </snapshots>
    </repository>
    </repositories>

    </profile>

    <profile>

        <id>Mule</id>
        <activation>
        <activeByDefault>true</activeByDefault>
        </activation>
        <repositories>
        <repository>
        <id>mulesoft-releases</id>
        <name>MuleSoft Repository</name>
        <url>http://repository.mulesoft.org/releases/</url>
        <layout>default</layout>
        </repository>
        <repository>
        <id>mulesoft-snapshots</id>
        <name>MuleSoft Snapshot Repository</name>
        <url>http://repository.mulesoft.org/snapshots/</url>
        <layout>default</layout>
        </repository>
        <repository>
        <id>mulesoft-public</id>
        <name>MuleSoft Public Repository</name>
        <url>https://repository.mulesoft.org/nexus/content/repositories/public/</url>
        <layout>default</layout>
        <releases>
        <enabled>true</enabled>
        </releases>
        <snapshots>
        <enabled>true</enabled>
        </snapshots>
        </repository>
        <repository>
          <id>Repository</id>
          <name>Corporate Repository</name>
                  <url>https://maven.anypoint.mulesoft.com/api/v2/organizations/maven</url>
          <layout>default</layout>
        </repository>
        </repositories>

    </profile> " >> settings.xml